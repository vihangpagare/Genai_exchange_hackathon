from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from document_ingestor import StartupAnalyzer

app = FastAPI(title="Startup Document Analyzer API", version="1.0.0")

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

class TextAnalysisRequest(BaseModel):
    email_text: str = None
    call_text: str = None

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Startup Document Analyzer API is running"}

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
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Call analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
