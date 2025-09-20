"""
Analysis API router for InvestAI platform.
Handles all analysis-related endpoints including text analysis, fact checking, and comprehensive analysis.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import Dict, Any, Optional
import logging
from pydantic import BaseModel
import asyncio
import time
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.artifacts import InMemoryArtifactService

from utils.agent_runner import run_agent, AgentError
from config import get_settings

# Import specialized agents
from factcheck_agent import factcheck_agent
from business_model_agent import startup_economics_analyzer
from market_intelligence import market_intelligence_analyzer
from risk_assesment import risk_assessment_analyzer
from investment_recommendation import recommendation_agent

# Optional imports for specialized agents
try:
    from competition_discovery import competitor_discovery_analyzer
    COMPETITION_AVAILABLE = True
except ImportError:
    COMPETITION_AVAILABLE = False

try:
    from founders_research import founder_research_agent
    FOUNDERS_AVAILABLE = True
except ImportError:
    FOUNDERS_AVAILABLE = False

try:
    from market_size_problem_size import market_size_analyzer
    MARKET_SIZE_AVAILABLE = True
except ImportError:
    MARKET_SIZE_AVAILABLE = False

try:
    from product_information import product_info_analyzer
    PRODUCT_INFO_AVAILABLE = True
except ImportError:
    PRODUCT_INFO_AVAILABLE = False

logger = logging.getLogger(__name__)
settings = get_settings()

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

# Helper function to run specialized agents
async def run_specialized_agent(agent, app_name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Run a specialized agent with proper session and artifact management."""
    try:
        # Create session and artifact services
        session_service = InMemorySessionService()
        artifact_service = InMemoryArtifactService()
        
        # Create session
        session = await session_service.create_session(
            user_id="Analysis_API",
            state={}
        )
        
        # Create runner
        runner = Runner(
            agent=agent,
            app_name=app_name,
            session_service=session_service,
            artifact_service=artifact_service
        )
        
        # Run the agent
        result = await runner.run(
            input_data=input_data,
            session_id=session.id
        )
        
        return {
            "success": True,
            "response": result.get("response", "Analysis completed"),
            "agent_name": app_name,
            "data": result
        }
        
    except Exception as e:
        logger.error(f"Error running specialized agent {app_name}: {e}")
        return {
            "success": False,
            "error": str(e),
            "agent_name": app_name
        }

# Pydantic models for request/response
class TextAnalysisRequest(BaseModel):
    text: str
    analysis_type: str = "comprehensive"

class FactCheckRequest(BaseModel):
    text: str
    context: Optional[str] = None

class ComprehensiveAnalysisRequest(BaseModel):
    startup_data: Dict[str, Any]
    analysis_types: list = ["fact_check", "market_analysis", "risk_assessment"]

class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    analysis_type: str
    processing_time: Optional[float] = None

@router.post("/text", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """
    Analyze text content using AI agents.
    
    Args:
        request: Text analysis request containing text and analysis type
        
    Returns:
        Analysis results with success status and data
    """
    try:
        print(f"\n🔍 [ANALYSIS] Starting text analysis for type: {request.analysis_type}")
        print(f"📝 [ANALYSIS] Text length: {len(request.text)} characters")
        logger.info(f"Starting text analysis for type: {request.analysis_type}")
        
        # Import prompts dynamically to avoid circular imports
        from prompts import get_analysis_prompt
        
        prompt = get_analysis_prompt(request.analysis_type)
        
        print(f"🤖 [ANALYSIS] Running AI agent: text_analyzer")
        result = await run_agent(
            agent_name="text_analyzer",
            prompt=prompt,
            input_data={"text": request.text}
        )
        
        print(f"✅ [ANALYSIS] Text analysis completed successfully: {request.analysis_type}")
        logger.info(f"Text analysis completed for type: {request.analysis_type}")
        
        return AnalysisResponse(
            success=True,
            data=result,
            analysis_type=request.analysis_type,
            processing_time=result.get("processing_time")
        )
        
    except AgentError as e:
        logger.error(f"Agent error in text analysis: {e.message}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {e.message}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in text analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during text analysis"
        )

@router.post("/fact-check", response_model=AnalysisResponse)
async def fact_check(request: FactCheckRequest):
    """
    Perform fact-checking on provided text.
    
    Args:
        request: Fact check request containing text and optional context
        
    Returns:
        Fact check results with verification status
    """
    try:
        print(f"\n🔍 [FACT CHECK] Starting fact check analysis")
        print(f"📝 [FACT CHECK] Text length: {len(request.text)} characters")
        logger.info("Starting fact check analysis")
        
        from prompts import FACTCHECK_PROMPT
        
        print(f"🤖 [FACT CHECK] Running specialized factcheck_agent")
        
        # Prepare input data for the specialized agent
        input_data = {
            "text": request.text,
            "context": request.context or ""
        }
        
        # Run the specialized factcheck agent
        result = await run_specialized_agent(
            agent=factcheck_agent,
            app_name="FactCheck-Studio",
            input_data=input_data
        )
        
        print(f"✅ [FACT CHECK] Fact check analysis completed successfully")
        
        return AnalysisResponse(
            success=True,
            data=result,
            analysis_type="fact_check"
        )
        
    except AgentError as e:
        logger.error(f"Agent error in fact check: {e.message}")
        raise HTTPException(
            status_code=500,
            detail=f"Fact check failed: {e.message}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in fact check: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during fact check"
        )

@router.post("/comprehensive", response_model=AnalysisResponse)
async def comprehensive_analysis(
    request: ComprehensiveAnalysisRequest,
    background_tasks: BackgroundTasks
):
    """
    Perform comprehensive analysis on startup data.
    
    Args:
        request: Comprehensive analysis request with startup data
        background_tasks: FastAPI background tasks for async processing
        
    Returns:
        Analysis results or task ID for background processing
    """
    try:
        logger.info("Starting comprehensive analysis")
        
        # For now, run synchronously. Later this will be moved to background tasks
        from prompts import get_comprehensive_analysis_prompt
        
        prompt = get_comprehensive_analysis_prompt(request.analysis_types)
        
        result = await run_agent(
            agent_name="comprehensive_analyzer",
            prompt=prompt,
            input_data=request.startup_data,
            timeout=600  # 10 minutes for comprehensive analysis
        )
        
        return AnalysisResponse(
            success=True,
            data=result,
            analysis_type="comprehensive"
        )
        
    except AgentError as e:
        logger.error(f"Agent error in comprehensive analysis: {e.message}")
        raise HTTPException(
            status_code=500,
            detail=f"Comprehensive analysis failed: {e.message}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in comprehensive analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during comprehensive analysis"
        )

@router.get("/status/{task_id}")
async def get_analysis_status(task_id: str):
    """
    Get the status of a background analysis task.
    
    Args:
        task_id: Unique task identifier
        
    Returns:
        Task status and results if completed
    """
    # TODO: Implement task status tracking with Redis/Celery
    return {"status": "not_implemented", "message": "Task status tracking coming soon"}

@router.post("/business-model", response_model=AnalysisResponse)
async def business_model_analysis(request: TextAnalysisRequest):
    """
    Perform business model analysis using the specialized startup_economics_analyzer.
    
    Args:
        request: Text analysis request containing startup data
        
    Returns:
        Business model analysis results
    """
    try:
        print(f"\n💼 [BUSINESS MODEL] Starting business model analysis")
        print(f"📝 [BUSINESS MODEL] Text length: {len(request.text)} characters")
        logger.info("Starting business model analysis")
        
        # Prepare input data for the specialized agent
        input_data = {
            "text": request.text,
            "analysis_type": request.analysis_type
        }
        
        print(f"🤖 [BUSINESS MODEL] Running specialized startup_economics_analyzer")
        
        # Run the specialized business model agent
        result = await run_specialized_agent(
            agent=startup_economics_analyzer,
            app_name="BusinessModel-Studio",
            input_data=input_data
        )
        
        print(f"✅ [BUSINESS MODEL] Business model analysis completed successfully")
        
        return AnalysisResponse(
            success=True,
            data=result,
            analysis_type="business_model"
        )
        
    except Exception as e:
        logger.error(f"Error in business model analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Business model analysis error: {str(e)}"
        )

@router.post("/investment-recommendation", response_model=AnalysisResponse)
async def investment_recommendation_analysis(request: TextAnalysisRequest):
    """
    Perform investment recommendation analysis using the specialized investment_recommendation_analyzer.
    
    Args:
        request: Text analysis request containing startup data
        
    Returns:
        Investment recommendation analysis results
    """
    try:
        print(f"\n💰 [INVESTMENT] Starting investment recommendation analysis")
        print(f"📝 [INVESTMENT] Text length: {len(request.text)} characters")
        logger.info("Starting investment recommendation analysis")
        
        # Prepare input data for the specialized agent
        input_data = {
            "text": request.text,
            "analysis_type": request.analysis_type
        }
        
        print(f"🤖 [INVESTMENT] Running specialized investment_recommendation_analyzer")
        
        # Run the specialized investment recommendation agent
        result = await run_specialized_agent(
            agent=recommendation_agent,
            app_name="Investment-Studio",
            input_data=input_data
        )
        
        print(f"✅ [INVESTMENT] Investment recommendation analysis completed successfully")
        
        return AnalysisResponse(
            success=True,
            data=result,
            analysis_type="investment_recommendation"
        )
        
    except Exception as e:
        logger.error(f"Error in investment recommendation analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Investment recommendation analysis error: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint for analysis service."""
    return {
        "status": "healthy",
        "service": "analysis",
        "version": "1.0.0"
    }
