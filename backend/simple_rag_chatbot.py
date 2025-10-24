# """
# Simple RAG-based Chatbot for Startup Analysis
# A standalone chatbot that works with the existing agent infrastructure.
# """

# import asyncio
# import logging
# from typing import Dict, List, Any, Optional
# from config import get_settings
# from utils.agent_runner import AgentRunner
# import json

# logger = logging.getLogger(__name__)
# settings = get_settings()

# class SimpleRAGChatbot:
#     """Simple RAG-based chatbot that provides context-aware responses using startup data."""
    
#     def __init__(self):
#         self.agent_runner = AgentRunner()
        
#     def create_rag_prompt(self, question: str, startup_data: Dict[str, Any] = None) -> str:
#         """Create a RAG prompt with startup context and user question."""
        
#         # Format startup data if provided
#         context_text = ""
#         if startup_data:
#             context_text = self._format_startup_data(startup_data)
        
#         prompt = f"""
# You are an expert startup analyst and investment advisor chatbot. You have access to comprehensive data about a specific startup and can answer investor questions with concise, data-driven insights.

# STARTUP CONTEXT DATA:
# {context_text}

# INVESTOR QUESTION:
# {question}

# INSTRUCTIONS:
# 1. Use the provided startup context data to answer the question
# 2. If information is not available in the context, clearly state that
# 3. Provide specific, actionable insights based on the data
# 4. Reference specific metrics, analysis results, or data points when relevant
# 5. Structure your response in a professional, investment-focused manner
# 6. KEEP RESPONSES VERY CONCISE - MAXIMUM 1-2 LINES ONLY
# 7. Always maintain a professional, analytical tone suitable for investment decision-making
# 8. If the question is about analysis results, reference the specific analysis types available
# 9. If the question is about financials, reference the business model analysis
# 10. If the question is about market opportunity, reference the market intelligence analysis

# Please provide a concise, data-driven response to the investor's question in 1-2 lines maximum.
# """
#         return prompt
    
#     def _format_startup_data(self, startup_data: Dict[str, Any]) -> str:
#         """Format startup data into a readable string for the prompt."""
#         formatted_data = []
        
#         formatted_data.append("=== STARTUP INFORMATION ===")
#         formatted_data.append(f"Company Name: {startup_data.get('companyName', startup_data.get('name', 'N/A'))}")
#         formatted_data.append(f"Industry/Sector: {startup_data.get('industry', startup_data.get('sector', 'N/A'))}")
#         formatted_data.append(f"Stage: {startup_data.get('stage', 'N/A')}")
#         formatted_data.append(f"Team Size: {startup_data.get('teamSize', 'N/A')}")
#         formatted_data.append(f"Founded Year: {startup_data.get('foundedYear', 'N/A')}")
#         formatted_data.append(f"Description: {startup_data.get('description', 'N/A')}")
#         formatted_data.append(f"Overall Score: {startup_data.get('overallScore', 'N/A')}")
        
#         # Add analysis data if available
#         if 'analysis' in startup_data:
#             analysis = startup_data['analysis']
#             formatted_data.append("\n=== ANALYSIS RESULTS ===")
#             if 'individualAnalyses' in analysis:
#                 for analysis_type, analysis_data in analysis['individualAnalyses'].items():
#                     formatted_data.append(f"{analysis_type.replace('_', ' ').title()}:")
#                     formatted_data.append(f"  Status: {analysis_data.get('status', 'N/A')}")
#                     formatted_data.append(f"  Confidence: {analysis_data.get('confidence', 'N/A')}")
#                     if 'response' in analysis_data:
#                         formatted_data.append(f"  Key Insights: {analysis_data['response'][:500]}...")
#                     formatted_data.append("")
        
#         return "\n".join(formatted_data)
    
#     async def chat(self, startup_id: str, question: str, startup_data: Dict[str, Any] = None) -> Dict[str, Any]:
#         """Main chat function that processes investor questions."""
#         try:
#             # Create RAG prompt
#             prompt = self.create_rag_prompt(question, startup_data)
            
#             # Get response from AI
#             result = await self.agent_runner.run_agent_async(
#                 agent_name="simple_rag_chatbot",
#                 prompt=prompt,
#                 max_retries=2,
#                 timeout=60
#             )
            
#             if result.get("success"):
#                 return {
#                     "success": True,
#                     "response": result.get("response", "Unable to generate response. Please try again."),
#                     "context_used": {
#                         "has_startup_data": startup_data is not None,
#                         "startup_id": startup_id
#                     }
#                 }
#             else:
#                 return {
#                     "success": False,
#                     "error": result.get("error", "Unknown error"),
#                     "response": "Error processing question. Please try again."
#                 }
                
#         except Exception as e:
#             logger.error(f"Error in simple RAG chatbot: {e}")
#             return {
#                 "success": False,
#                 "error": str(e),
#                 "response": "Technical difficulties. Please try again later."
#             }
    
#     def get_suggested_questions(self, startup_data: Dict[str, Any] = None) -> List[str]:
#         """Generate suggested questions based on available startup data."""
#         try:
#             suggested_questions = [
#                 "What is this startup's business model?",
#                 "What problem does this startup solve?",
#                 "What is the target market size?",
#                 "Who are the main competitors?",
#                 "What is the team's background?",
#                 "What are the main risks?",
#                 "How does this startup compare to competitors?",
#                 "What is the funding history?"
#             ]
            
#             # Add analysis-specific questions if data is available
#             if startup_data and 'analysis' in startup_data and 'individualAnalyses' in startup_data['analysis']:
#                 analysis_types = startup_data['analysis']['individualAnalyses'].keys()
                
#                 if 'businessModelAnalysis' in analysis_types:
#                     suggested_questions.insert(0, "What does the business model analysis reveal?")
#                 if 'marketIntelligenceAnalysis' in analysis_types:
#                     suggested_questions.insert(1, "What are the market intelligence insights?")
#                 if 'riskAssessmentAnalysis' in analysis_types:
#                     suggested_questions.insert(2, "What are the main risks identified?")
#                 if 'competitionAnalysis' in analysis_types:
#                     suggested_questions.insert(3, "How does this startup compare to competitors?")
#                 if 'foundersAnalysis' in analysis_types:
#                     suggested_questions.insert(4, "What is the founders' background and experience?")
            
#             return suggested_questions[:8]  # Limit to 8 questions
            
#         except Exception as e:
#             logger.error(f"Error generating suggested questions: {e}")
#             return [
#                 "What is this startup's business model?",
#                 "What is the market opportunity?",
#                 "What are the main risks?",
#                 "How does this startup compare to competitors?"
#             ]

# # Global instance
# simple_rag_chatbot = SimpleRAGChatbot()


# simple_mixed_rag.py

import os
import numpy as np
import pandas as pd
from langchain_google_genai import GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI

import fitz

os.environ["GOOGLE_API_KEY"] = "AIzaSyBhlPg4FGWj6VGc5Io-4shslkv2eilAlUs"

EMBEDDING_MODEL_ID = "models/gemini-embedding-001"
MODEL_ID = "gemini-2.0-flash"

embeddings_model = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL_ID,
    task_type="RETRIEVAL_DOCUMENT"  # default for documents
)


# Extract text from PDFs
def get_pdf_documents(pdf_paths):
    documents = []
    for path in pdf_paths:
        doc = fitz.open(path)
        for page_num, page in enumerate(doc):
            text = page.get_text()
            if text.strip():
                documents.append({
                    'title': f"{path} - Page {page_num + 1}",
                    'text': text,
                    'type': 'pdf'
                })
        doc.close()
        print(f"✅ Processed PDF: {path}")
    return documents


# Process text documents
def get_text_documents(text_docs):
    documents = []
    for doc in text_docs:
        documents.append({
            'title': doc['title'],
            'text': doc['text'],
            'type': 'text'
        })
        print(f"✅ Processed text: {doc['title']}")
    return documents


# Combine all documents
def combine_documents(pdf_paths=None, text_docs=None):
    all_docs = []
    
    if pdf_paths:
        all_docs.extend(get_pdf_documents(pdf_paths))
    
    if text_docs:
        all_docs.extend(get_text_documents(text_docs))
    
    print(f"\n✅ Total documents: {len(all_docs)}")
    return all_docs
def extract_text_from_response(response):
    """
    Try several common response shapes and return a simple string.
    This prevents printed AIMessage / object dumps and ensures we return plain text.
    """
    if response is None:
        return ""
    # Common: response.text
    if hasattr(response, "text") and isinstance(response.text, str):
        return response.text.strip()
    # Some wrappers use .content
    if hasattr(response, "content") and isinstance(response.content, str):
        return response.content.strip()
    # LangChain-like .generations or nested lists
    if hasattr(response, "generations"):
        gens = response.generations
        try:
            # Try nested list format: generations[0][0].text
            if isinstance(gens, (list, tuple)) and len(gens) > 0:
                first = gens[0]
                if isinstance(first, (list, tuple)) and len(first) > 0 and hasattr(first[0], "text"):
                    return first[0].text.strip()
                # sometimes generations[0].text
                if hasattr(first, "text"):
                    return first.text.strip()
        except Exception:
            pass
    # dict-like responses
    if isinstance(response, dict):
        for key in ("text", "answer", "content", "output"):
            if key in response and isinstance(response[key], str):
                return response[key].strip()
        # sometimes nested under 'choices' like OpenAI-style
        if "choices" in response and isinstance(response["choices"], (list, tuple)) and len(response["choices"])>0:
            c0 = response["choices"][0]
            if isinstance(c0, dict) and "text" in c0 and isinstance(c0["text"], str):
                return c0["text"].strip()
    # Fallback: string conversion (useful for debugging)
    return str(response).strip()


# Embedding function
def embed_fn(title, text):
    # Here we embed a single piece of text (we could also batch later)
    vector = embeddings_model.embed_documents([text], titles=[title])[0]
    return vector

# Create embeddings dataframe
def create_embeddings_df(documents):
    df = pd.DataFrame(documents)
    print(f"🔄 Creating embeddings for {len(df)} documents...")
    # Apply embed_fn row-by-row (could be improved to batch)
    df['Embeddings'] = df.apply(lambda row: embed_fn(row['title'], row['text']), axis=1)
    print("✅ Embeddings created")
    return df

def find_top_k_passages(query, dataframe, top_k=5):
    # Use embed_query for the query embedding
    query_vec = embeddings_model.embed_query(query, task_type="RETRIEVAL_QUERY")
    # Compute dot products
    vectors = np.stack(dataframe['Embeddings'].to_numpy())
    dot_products = np.dot(vectors, query_vec)
    top_k_indices = np.argsort(dot_products)[::-1][:top_k]
    results = []
    for idx in top_k_indices:
        results.append({
            'title': dataframe.iloc[idx]['title'],
            'text': dataframe.iloc[idx]['text'],
            'type': dataframe.iloc[idx]['type'],
            'score': float(dot_products[idx])
        })
    return results

def answer_query(query, dataframe, top_k=5):
    passages = find_top_k_passages(query, dataframe, top_k)

    # Build concise context: only include short excerpts to keep prompt size reasonable
    # Take first N chars of each passage to avoid huge prompts; you can adjust excerpt_len
      # adjust depending on token limits
    context_pieces = []
    for i, p in enumerate(passages, 1):
        excerpt = p['text']
        
        excerpt = excerpt.rsplit("\n", 1)[0] + " ...[truncated]"
        context_pieces.append(f"[{i}] ({p['type'].upper()}): {p['title']}\n{excerpt}")

    context = "\n\n".join(context_pieces)

    # Improved RAG prompt for investor Q&A
    system_instructions = (
        "You are an expert investor relations assistant that answers investor questions. Respond to normal about what you do naturally"
        "from the supplied startup documents. Use ONLY the provided context—do NOT invent facts. "
        "Cite the specific sources inline using bracketed numeric citations that map to the context items: "
        "for example [1], [2]. If the context does not contain the answer, respond: "
        "'I don't know based on the provided documents.'\n"
        "Highlight any assumptions or missing data needed for a full evaluation."
    )

    user_prompt = (
        f"Context (each item is numbered; cite with [1], [2], ...):\n\n{context}\n\n"
        f"QUESTION: {query}\n\n"
        "Answer (only the answer text—no extra metadata or apologies):"
    )

    # Use ChatGoogleGenerativeAI and pass system + user roles if supported
    llm = ChatGoogleGenerativeAI(
        model=MODEL_ID,
        temperature=0.3,   # deterministic answers for investor Q&A # adjust as needed
    )

    # Some wrappers accept a single string, others accept messages; try both patterns safely
    response = None
    try:
        # Preferred: structured messages if the wrapper supports 'invoke' with role separation
        # Many langchain chat wrappers accept a single prompt string too; we try invoke(user_prompt) fallback below.
        # Try sending a combined prompt (some wrappers ignore role separation).
        response = llm.invoke(f"SYSTEM: {system_instructions}\n\n{user_prompt}")
    except Exception:
        try:
            # fallback to just the user prompt string
            response = llm.invoke(user_prompt)
        except Exception as e:
            # As a last resort, try generate/generate_text if available
            try:
                response = llm.generate([{"role":"system","content":system_instructions},
                                         {"role":"user","content":user_prompt}])
            except Exception as e2:
                # Return a helpful message (already text) so caller doesn't crash
                return f"Error invoking model: {e}; fallback error: {e2}"

    # Extract the plain text safely
    answer_text = extract_text_from_response(response)

    # Post-processing: ensure we return only the answer (strip leading/trailing quotes/newlines)
    answer_text = answer_text.strip().strip('"').strip("'")

    # Print sources and the concise answer for the interactive loop
    print(f"\n🔍 Query: {query}")
    print("📚 Sources used:")
    for i, p in enumerate(passages, 1):
        icon = "📄" if p['type'] == 'pdf' else "📝"
        print(f"  {i}. {icon} {p['title']} (score: {p['score']:.4f})")
    print(f"\n💡 Answer:\n{answer_text}\n")

    return answer_text

# Usage
if __name__ == "__main__":
    pdf_paths = ["Ziniosa Pitch Deck.pdf", "startup_deck.pdf"]
    text_docs = [
        {'title': 'Company Info', 'text': 'Company XYZ founded in 2023...'},
        {'title': 'Product', 'text': 'AI diagnostic assistant with 95% accuracy...'},
        {'title': 'Market', 'text': 'Healthcare AI market worth $50B...'}
    ]

    print("\n" + "="*60)
    print("📚 MULTIMODAL RAG - PDFs + Text Documents")
    print("="*60 + "\n")

    documents = combine_documents(pdf_paths=pdf_paths, text_docs=text_docs)
    df = create_embeddings_df(documents)
    df.to_pickle("mixed_docs.pkl")
    df = pd.read_pickle("mixed_docs.pkl")

    print("\n💬 Interactive Mode (type 'quit' to exit)")
    while True:
        q = input("\n🧑 You: ").strip()
        if q.lower() in ['quit', 'q']:
            break
        if q:
            answer_query(q, df, top_k=5)
