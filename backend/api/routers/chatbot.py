"""
Chatbot API endpoints for RAG-based startup analysis.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging
from simple_rag_chatbot import simple_rag_chatbot

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

class ChatRequest(BaseModel):
    startup_id: str
    question: str
    startup_data: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    context_used: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class SuggestedQuestionsResponse(BaseModel):
    success: bool
    questions: List[str]
    error: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_startup(request: ChatRequest):
    """
    Chat with the RAG-based chatbot about a specific startup.
    """
    try:
        logger.info(f"Chat request for startup {request.startup_id}: {request.question}")
        
        result = await simple_rag_chatbot.chat(request.startup_id, request.question, request.startup_data)
        
        return ChatResponse(
            success=result["success"],
            response=result["response"],
            context_used=result.get("context_used"),
            error=result.get("error")
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suggested-questions/{startup_id}", response_model=SuggestedQuestionsResponse)
async def get_suggested_questions(startup_id: str):
    """
    Get suggested questions for a specific startup based on available data.
    """
    try:
        logger.info(f"Getting suggested questions for startup {startup_id}")
        
        questions = simple_rag_chatbot.get_suggested_questions()
        
        return SuggestedQuestionsResponse(
            success=True,
            questions=questions
        )
        
    except Exception as e:
        logger.error(f"Error getting suggested questions: {e}")
        return SuggestedQuestionsResponse(
            success=False,
            questions=[],
            error=str(e)
        )

@router.get("/health")
async def health_check():
    """
    Health check for the chatbot service.
    """
    return {"status": "healthy", "service": "rag_chatbot"}
