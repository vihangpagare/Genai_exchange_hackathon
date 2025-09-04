"""
main.py — Fact-checking agent runner
• Sessions live only in RAM (InMemorySessionService)  
• Artifacts are persisted (in-memory)
"""

import asyncio, os
from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.artifacts import InMemoryArtifactService
from factcheck_agent import factcheck_agent
from google.genai import types

load_dotenv()

# ────────────────────────────────────────────────────────────────
# 1. Session service - in-memory, wiped when the app exits
# ────────────────────────────────────────────────────────────────
session_service = InMemorySessionService() # sessions are *not* saved to disk

# ────────────────────────────────────────────────────────────────
# 2. Artifact service (in-memory)
# ────────────────────────────────────────────────────────────────
artifact_service = InMemoryArtifactService()
print("⚠️ Using in-memory artifacts")

# ────────────────────────────────────────────────────────────────
# 3. Helper function for async calls (EXACTLY like your utils.py)
# ────────────────────────────────────────────────────────────────
async def call_agent_async(runner, user_id, session_id, query):
    """Call the agent asynchronously - COPIED from your utils.py"""
    content = types.Content(role="user", parts=[types.Part(text=query)])
    print(f"\n--- Running Query: {query} ---")
    
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
        print(error_msg)
        return error_msg
    
    return last_response or "No response received from agent"

async def _process_event(event):
    """Extract text parts from an ADK streaming event - COPIED from your utils.py"""
    final_response = None
    if event.content and event.content.parts:
        for part in event.content.parts:
            text = getattr(part, "text", "").strip()
            if text:
                final_response = text
                print(f"🤖 {text}")
    return final_response

# ────────────────────────────────────────────────────────────────
# 4. Main event loop (exactly following your pattern)
# ────────────────────────────────────────────────────────────────
async def main_async() -> None:
    APP_NAME = "FactCheck-Studio"
    USER_ID = "Investment_Analyst"
    
    # Always start a fresh session — no DB lookup / resume
    session = await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        state={}  # empty initial state
    )
    
    SESSION_ID = session.id
    print(f"🔄 New ephemeral session: {SESSION_ID}")
    
    runner = Runner(
        agent=factcheck_agent,
        app_name=APP_NAME,
        session_service=session_service,
        artifact_service=artifact_service
    )
    
    # print("\nWelcome to FactCheck-Studio! (type 'exit' to quit)")
    # print("📋 You can:")
    # print("   • Paste startup data for fact-checking")
    # print("   • Ask to verify specific claims") 
    # print("   • Request market data validation")
    # print("   • Check team credentials\n")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in {"exit", "quit"}:
            
            break
        
        # Use the corrected call_agent_async function
        await call_agent_async(runner, USER_ID, SESSION_ID, user_input)

if __name__ == "__main__":
    asyncio.run(main_async())
