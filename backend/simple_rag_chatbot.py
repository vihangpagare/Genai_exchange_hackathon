"""
Simple RAG-based Chatbot for Startup Analysis
A standalone chatbot that works with the existing agent infrastructure.
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional
import google.generativeai as genai
from config import get_settings
from utils.agent_runner import AgentRunner
import json

logger = logging.getLogger(__name__)
settings = get_settings()

class SimpleRAGChatbot:
    """Simple RAG-based chatbot that provides context-aware responses using startup data."""
    
    def __init__(self):
        self.agent_runner = AgentRunner()
        
    def create_rag_prompt(self, question: str, startup_data: Dict[str, Any] = None) -> str:
        """Create a RAG prompt with startup context and user question."""
        
        # Format startup data if provided
        context_text = ""
        if startup_data:
            context_text = self._format_startup_data(startup_data)
        
        prompt = f"""
You are an expert startup analyst and investment advisor chatbot. You have access to comprehensive data about a specific startup and can answer investor questions with concise, data-driven insights.

STARTUP CONTEXT DATA:
{context_text}

INVESTOR QUESTION:
{question}

INSTRUCTIONS:
1. Use the provided startup context data to answer the question
2. If information is not available in the context, clearly state that
3. Provide specific, actionable insights based on the data
4. Reference specific metrics, analysis results, or data points when relevant
5. Structure your response in a professional, investment-focused manner
6. KEEP RESPONSES VERY CONCISE - MAXIMUM 1-2 LINES ONLY
7. Always maintain a professional, analytical tone suitable for investment decision-making
8. If the question is about analysis results, reference the specific analysis types available
9. If the question is about financials, reference the business model analysis
10. If the question is about market opportunity, reference the market intelligence analysis

Please provide a concise, data-driven response to the investor's question in 1-2 lines maximum.
"""
        return prompt
    
    def _format_startup_data(self, startup_data: Dict[str, Any]) -> str:
        """Format startup data into a readable string for the prompt."""
        formatted_data = []
        
        formatted_data.append("=== STARTUP INFORMATION ===")
        formatted_data.append(f"Company Name: {startup_data.get('companyName', startup_data.get('name', 'N/A'))}")
        formatted_data.append(f"Industry/Sector: {startup_data.get('industry', startup_data.get('sector', 'N/A'))}")
        formatted_data.append(f"Stage: {startup_data.get('stage', 'N/A')}")
        formatted_data.append(f"Team Size: {startup_data.get('teamSize', 'N/A')}")
        formatted_data.append(f"Founded Year: {startup_data.get('foundedYear', 'N/A')}")
        formatted_data.append(f"Description: {startup_data.get('description', 'N/A')}")
        formatted_data.append(f"Overall Score: {startup_data.get('overallScore', 'N/A')}")
        
        # Add analysis data if available
        if 'analysis' in startup_data:
            analysis = startup_data['analysis']
            formatted_data.append("\n=== ANALYSIS RESULTS ===")
            if 'individualAnalyses' in analysis:
                for analysis_type, analysis_data in analysis['individualAnalyses'].items():
                    formatted_data.append(f"{analysis_type.replace('_', ' ').title()}:")
                    formatted_data.append(f"  Status: {analysis_data.get('status', 'N/A')}")
                    formatted_data.append(f"  Confidence: {analysis_data.get('confidence', 'N/A')}")
                    if 'response' in analysis_data:
                        formatted_data.append(f"  Key Insights: {analysis_data['response'][:500]}...")
                    formatted_data.append("")
        
        return "\n".join(formatted_data)
    
    async def chat(self, startup_id: str, question: str, startup_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Main chat function that processes investor questions."""
        try:
            # Create RAG prompt
            prompt = self.create_rag_prompt(question, startup_data)
            
            # Get response from AI
            result = await self.agent_runner.run_agent_async(
                agent_name="simple_rag_chatbot",
                prompt=prompt,
                max_retries=2,
                timeout=60
            )
            
            if result.get("success"):
                return {
                    "success": True,
                    "response": result.get("response", "Unable to generate response. Please try again."),
                    "context_used": {
                        "has_startup_data": startup_data is not None,
                        "startup_id": startup_id
                    }
                }
            else:
                return {
                    "success": False,
                    "error": result.get("error", "Unknown error"),
                    "response": "Error processing question. Please try again."
                }
                
        except Exception as e:
            logger.error(f"Error in simple RAG chatbot: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "Technical difficulties. Please try again later."
            }
    
    def get_suggested_questions(self, startup_data: Dict[str, Any] = None) -> List[str]:
        """Generate suggested questions based on available startup data."""
        try:
            suggested_questions = [
                "What is this startup's business model?",
                "What problem does this startup solve?",
                "What is the target market size?",
                "Who are the main competitors?",
                "What is the team's background?",
                "What are the main risks?",
                "How does this startup compare to competitors?",
                "What is the funding history?"
            ]
            
            # Add analysis-specific questions if data is available
            if startup_data and 'analysis' in startup_data and 'individualAnalyses' in startup_data['analysis']:
                analysis_types = startup_data['analysis']['individualAnalyses'].keys()
                
                if 'businessModelAnalysis' in analysis_types:
                    suggested_questions.insert(0, "What does the business model analysis reveal?")
                if 'marketIntelligenceAnalysis' in analysis_types:
                    suggested_questions.insert(1, "What are the market intelligence insights?")
                if 'riskAssessmentAnalysis' in analysis_types:
                    suggested_questions.insert(2, "What are the main risks identified?")
                if 'competitionAnalysis' in analysis_types:
                    suggested_questions.insert(3, "How does this startup compare to competitors?")
                if 'foundersAnalysis' in analysis_types:
                    suggested_questions.insert(4, "What is the founders' background and experience?")
            
            return suggested_questions[:8]  # Limit to 8 questions
            
        except Exception as e:
            logger.error(f"Error generating suggested questions: {e}")
            return [
                "What is this startup's business model?",
                "What is the market opportunity?",
                "What are the main risks?",
                "How does this startup compare to competitors?"
            ]

# Global instance
simple_rag_chatbot = SimpleRAGChatbot()
