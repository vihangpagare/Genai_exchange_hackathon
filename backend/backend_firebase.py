from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
import asyncio
from document_ingestor import StartupAnalyzer
from factcheck_agent import factcheck_agent
from business_model_agent import startup_economics_analyzer
from market_intelligence import market_intelligence_analyzer
from risk_assesment import risk_assessment_analyzer
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.artifacts import InMemoryArtifactService
from google.genai import types

app = FastAPI(title="AI-Powered Startup Investment Analysis Platform", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzer
analyzer = StartupAnalyzer()

# Initialize fact-checking services
session_service = InMemorySessionService()
artifact_service = InMemoryArtifactService()

# Pydantic models
class TextAnalysisRequest(BaseModel):
    email_text: str = None
    call_text: str = None

class FactCheckRequest(BaseModel):
    content: str
    analysis_type: str = "general"  # general, document, email, call

class ComprehensiveAnalysisRequest(BaseModel):
    content: str
    analysis_type: str = "document"  # document, email, call
    include_business_model: bool = True
    include_market_intelligence: bool = True
    include_risk_assessment: bool = True
    include_fact_check: bool = True

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "AI-Powered Startup Investment Analysis Platform is running"}

@app.post("/analyze/document")
async def analyze_document(file: UploadFile = File(...)):
    """
    Analyze uploaded document (PDF, PPTX, PPT)
    """
    try:
        # Validate file type
        allowed_types = {
            'application/pdf': '.pdf',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
            'application/vnd.ms-powerpoint': '.ppt'
        }
        
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {file.content_type}. Supported types: PDF, PPTX, PPT"
            )
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=allowed_types[file.content_type]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Analyze the document
            if file.content_type == 'application/pdf':
                result = analyzer.analyze_pdf_document(tmp_file_path)
            else:
                # For now, we'll handle PPTX/PPT as PDFs (you can extend this)
                result = analyzer.analyze_pdf_document(tmp_file_path)
            
            # Add metadata for Firebase
            result['filename'] = file.filename
            result['file_size'] = len(content)
            result['ready_for_firebase'] = True
            
            return result
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

@app.post("/analyze/email")
async def analyze_email(request: TextAnalysisRequest):
    """
    Analyze email text
    """
    try:
        if not request.email_text:
            raise HTTPException(status_code=400, detail="Email text is required")
        
        result = analyzer.analyze_raw_email(request.email_text)
        result['ready_for_firebase'] = True
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email analysis failed: {str(e)}")

@app.post("/analyze/call")
async def analyze_call(request: TextAnalysisRequest):
    """
    Analyze call transcript text
    """
    try:
        if not request.call_text:
            raise HTTPException(status_code=400, detail="Call text is required")
        
        result = analyzer.analyze_raw_call_transcript(request.call_text)
        result['ready_for_firebase'] = True
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Call analysis failed: {str(e)}")

# Fact-checking helper functions
async def call_agent_async(runner, user_id, session_id, query):
    """Call the fact-checking agent asynchronously"""
    content = types.Content(role="user", parts=[types.Part(text=query)])

    last_response = None
    try:
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
        ):
            response = await _process_event(event)
            if response:
                last_response = response

    except Exception as exc:
        error_msg = f"Error during agent call: {exc}"
        return error_msg

    return last_response or "No response received from agent"

async def _process_event(event):
    """Extract text parts from an ADK streaming event"""
    final_response = None
    if event.content and event.content.parts:
        for part in event.content.parts:
            text = getattr(part, "text", "").strip()
            if text:
                final_response = text
    return final_response

@app.post("/analyze/factcheck")
async def fact_check_content(request: FactCheckRequest):
    """
    Fact-check content using AI agent with web search
    """
    try:
        if not request.content:
            raise HTTPException(status_code=400, detail="Content is required for fact-checking")
        
        # Create a new session
        session = await session_service.create_session(
            app_name="FactCheck-Studio",
            user_id="Investment_Analyst",
            state={}
        )
        
        # Create runner
        runner = Runner(
            agent=factcheck_agent,
            app_name="FactCheck-Studio",
            session_service=session_service,
            artifact_service=artifact_service
        )
        
        # Create fact-check query
        factcheck_query = f"""
        Please fact-check the following {request.analysis_type} content:
        
        {request.content}
        
        Provide a comprehensive analysis including data normalization, internal consistency checks, and external verification where possible.
        """
        
        # Call the fact-checking agent
        result = await call_agent_async(
            runner=runner,
            user_id="Investment_Analyst",
            session_id=session.id,
            query=factcheck_query
        )
        
        return {
            "document_type": f"factcheck_{request.analysis_type}",
            "analysis": result,
            "status": "success",
            "session_id": session.id,
            "ready_for_firebase": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fact-checking failed: {str(e)}")

# New comprehensive analysis endpoints

@app.post("/analyze/business-model")
async def analyze_business_model(request: TextAnalysisRequest):
    """
    Analyze business model using the economics analyzer
    """
    try:
        content = request.email_text or request.call_text
        if not content:
            raise HTTPException(status_code=400, detail="Content is required for business model analysis")
        
        # Create a new session
        session = await session_service.create_session(
            app_name="BusinessModel-Studio",
            user_id="Investment_Analyst",
            state={}
        )
        
        # Create runner
        runner = Runner(
            agent=startup_economics_analyzer,
            app_name="BusinessModel-Studio",
            session_service=session_service,
            artifact_service=artifact_service
        )
        
        # Call the business model analyzer
        result = await call_agent_async(
            runner=runner,
            user_id="Investment_Analyst",
            session_id=session.id,
            query=content
        )
        
        return {
            "document_type": "business_model_analysis",
            "analysis": result,
            "status": "success",
            "session_id": session.id,
            "ready_for_firebase": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Business model analysis failed: {str(e)}")

@app.post("/analyze/market-intelligence")
async def analyze_market_intelligence(request: TextAnalysisRequest):
    """
    Analyze market intelligence using the market intelligence analyzer
    """
    try:
        content = request.email_text or request.call_text
        if not content:
            raise HTTPException(status_code=400, detail="Content is required for market intelligence analysis")
        
        # Create a new session
        session = await session_service.create_session(
            app_name="MarketIntel-Studio",
            user_id="Investment_Analyst",
            state={}
        )
        
        # Create runner
        runner = Runner(
            agent=market_intelligence_analyzer,
            app_name="MarketIntel-Studio",
            session_service=session_service,
            artifact_service=artifact_service
        )
        
        # Call the market intelligence analyzer
        result = await call_agent_async(
            runner=runner,
            user_id="Investment_Analyst",
            session_id=session.id,
            query=content
        )
        
        return {
            "document_type": "market_intelligence_analysis",
            "analysis": result,
            "status": "success",
            "session_id": session.id,
            "ready_for_firebase": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market intelligence analysis failed: {str(e)}")

@app.post("/analyze/risk-assessment")
async def analyze_risk_assessment(request: TextAnalysisRequest):
    """
    Analyze risk assessment using the risk assessment analyzer
    """
    try:
        content = request.email_text or request.call_text
        if not content:
            raise HTTPException(status_code=400, detail="Content is required for risk assessment analysis")
        
        # Create a new session
        session = await session_service.create_session(
            app_name="RiskAssessment-Studio",
            user_id="Investment_Analyst",
            state={}
        )
        
        # Create runner
        runner = Runner(
            agent=risk_assessment_analyzer,
            app_name="RiskAssessment-Studio",
            session_service=session_service,
            artifact_service=artifact_service
        )
        
        # Call the risk assessment analyzer
        result = await call_agent_async(
            runner=runner,
            user_id="Investment_Analyst",
            session_id=session.id,
            query=content
        )
        
        return {
            "document_type": "risk_assessment_analysis",
            "analysis": result,
            "status": "success",
            "session_id": session.id,
            "ready_for_firebase": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk assessment analysis failed: {str(e)}")

@app.post("/analyze/comprehensive")
async def comprehensive_analysis(request: ComprehensiveAnalysisRequest):
    """
    Perform comprehensive analysis including all available analysis types
    """
    try:
        if not request.content:
            raise HTTPException(status_code=400, detail="Content is required for comprehensive analysis")
        
        results = {
            "document_type": "comprehensive_analysis",
            "status": "success",
            "analyses": {},
            "ready_for_firebase": True
        }
        
        # Basic analysis first
        if request.analysis_type == "email":
            basic_result = analyzer.analyze_raw_email(request.content)
            results["analyses"]["basic_analysis"] = basic_result
        elif request.analysis_type == "call":
            basic_result = analyzer.analyze_raw_call_transcript(request.content)
            results["analyses"]["basic_analysis"] = basic_result
        
        # Business Model Analysis
        if request.include_business_model:
            try:
                session = await session_service.create_session(
                    app_name="BusinessModel-Studio",
                    user_id="Investment_Analyst",
                    state={}
                )
                
                runner = Runner(
                    agent=startup_economics_analyzer,
                    app_name="BusinessModel-Studio",
                    session_service=session_service,
                    artifact_service=artifact_service
                )
                
                business_result = await call_agent_async(
                    runner=runner,
                    user_id="Investment_Analyst",
                    session_id=session.id,
                    query=request.content
                )
                
                results["analyses"]["business_model"] = business_result
            except Exception as e:
                results["analyses"]["business_model"] = f"Business model analysis failed: {str(e)}"
        
        # Market Intelligence Analysis
        if request.include_market_intelligence:
            try:
                session = await session_service.create_session(
                    app_name="MarketIntel-Studio",
                    user_id="Investment_Analyst",
                    state={}
                )
                
                runner = Runner(
                    agent=market_intelligence_analyzer,
                    app_name="MarketIntel-Studio",
                    session_service=session_service,
                    artifact_service=artifact_service
                )
                
                market_result = await call_agent_async(
                    runner=runner,
                    user_id="Investment_Analyst",
                    session_id=session.id,
                    query=request.content
                )
                
                results["analyses"]["market_intelligence"] = market_result
            except Exception as e:
                results["analyses"]["market_intelligence"] = f"Market intelligence analysis failed: {str(e)}"
        
        # Risk Assessment Analysis
        if request.include_risk_assessment:
            try:
                session = await session_service.create_session(
                    app_name="RiskAssessment-Studio",
                    user_id="Investment_Analyst",
                    state={}
                )
                
                runner = Runner(
                    agent=risk_assessment_analyzer,
                    app_name="RiskAssessment-Studio",
                    session_service=session_service,
                    artifact_service=artifact_service
                )
                
                risk_result = await call_agent_async(
                    runner=runner,
                    user_id="Investment_Analyst",
                    session_id=session.id,
                    query=request.content
                )
                
                results["analyses"]["risk_assessment"] = risk_result
            except Exception as e:
                results["analyses"]["risk_assessment"] = f"Risk assessment analysis failed: {str(e)}"
        
        # Fact Check Analysis
        if request.include_fact_check:
            try:
                session = await session_service.create_session(
                    app_name="FactCheck-Studio",
                    user_id="Investment_Analyst",
                    state={}
                )
                
                runner = Runner(
                    agent=factcheck_agent,
                    app_name="FactCheck-Studio",
                    session_service=session_service,
                    artifact_service=artifact_service
                )
                
                factcheck_query = f"""
                Please fact-check the following {request.analysis_type} content:
                
                {request.content}
                
                Provide a comprehensive analysis including data normalization, internal consistency checks, and external verification where possible.
                """
                
                factcheck_result = await call_agent_async(
                    runner=runner,
                    user_id="Investment_Analyst",
                    session_id=session.id,
                    query=factcheck_query
                )
                
                results["analyses"]["fact_check"] = factcheck_result
            except Exception as e:
                results["analyses"]["fact_check"] = f"Fact-checking failed: {str(e)}"
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comprehensive analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
