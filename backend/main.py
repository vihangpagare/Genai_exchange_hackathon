"""
Main FastAPI application for InvestAI platform.
Consolidates all API routes and provides a unified backend interface.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from config import get_settings, validate_api_keys
from api.routers import analysis, profiles, chatbot, meetings
from utils.exceptions import InvestAIException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # This ensures logs go to terminal
        logging.FileHandler('investai.log')  # Also save to file
    ]
)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting InvestAI backend...")
    
    # Validate configuration
    if not validate_api_keys():
        logger.error("Invalid configuration. Please check your .env file.")
        raise RuntimeError("Invalid configuration")
    
    logger.info("InvestAI backend started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down InvestAI backend...")

# Create FastAPI application
app = FastAPI(
    title="InvestAI Platform API",
    description="AI-powered startup analysis and investor matching platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app"]
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Custom exception handler for InvestAI exceptions
@app.exception_handler(InvestAIException)
async def investai_exception_handler(request: Request, exc: InvestAIException):
    """Handle InvestAI custom exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.to_dict()
    )

# Global exception handler for unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "error_type": "internal_error",
            "message": "An unexpected error occurred. Please try again later.",
            "details": {
                "request_id": getattr(request.state, "request_id", None),
                "exception_type": type(exc).__name__
            }
        }
    )

# Include routers
app.include_router(analysis.router)
app.include_router(profiles.router)
app.include_router(chatbot.router)
app.include_router(meetings.router)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "InvestAI Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0",
        "environment": settings.environment
    }

# API status endpoint
@app.get("/api/status")
async def api_status():
    """API status and configuration info."""
    return {
        "api_status": "operational",
        "version": "1.0.0",
        "environment": settings.environment,
        "debug_mode": settings.debug,
        "features": {
            "analysis": True,
            "profiles": True,
            "authentication": True,
            "caching": False,  # Will be True when Redis is implemented
            "background_tasks": False  # Will be True when Celery is implemented
        }
    }

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )