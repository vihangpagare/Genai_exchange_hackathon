"""
Centralized agent runner utility for InvestAI platform.
Provides a unified interface for running AI agents with proper error handling and logging.
"""

import asyncio
import logging
from typing import Any, Dict, Optional, List
from langchain_google_genai import ChatGoogleGenerativeAI
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

class AgentRunner:
    """Centralized agent runner with error handling and configuration management."""

    def __init__(self):
        # Initialise Gemini via LangChain wrapper (API key picked up from env var GOOGLE_API_KEY)
        self.model = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
        self.safety_settings = [
            {"category": "HARM_CATEGORY_HATE_SPEECH",       "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HARASSMENT",        "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
    
    async def run_agent_async(
        self,
        agent_name: str,
        prompt: str,
        input_data: Any = None,
        max_retries: int = 3,
        timeout: int = 300
    ) -> Dict[str, Any]:
        """
        Run an agent asynchronously with proper error handling and retries.
        
        Args:
            agent_name: Name of the agent for logging purposes
            prompt: The prompt to send to the agent
            input_data: Optional input data to include in the prompt
            max_retries: Maximum number of retry attempts
            timeout: Timeout in seconds
            
        Returns:
            Dictionary containing the agent response and metadata
            
        Raises:
            AgentError: If the agent fails after all retries
        """
        logger.info(f"Starting {agent_name} agent execution")
        
        for attempt in range(max_retries + 1):
            try:
                # Prepare the full prompt
                full_prompt = self._prepare_prompt(prompt, input_data)
                
                # Run the agent with timeout
                response = await asyncio.wait_for(
                    self._execute_agent(full_prompt),
                    timeout=timeout
                )
                
                logger.info(f"{agent_name} agent completed successfully")
                return {
                    "success": True,
                    "agent_name": agent_name,
                    "response": response,
                    "attempts": attempt + 1,
                    "error": None
                }
                
            except asyncio.TimeoutError:
                error_msg = f"{agent_name} agent timed out after {timeout} seconds"
                logger.warning(f"{error_msg} (attempt {attempt + 1}/{max_retries + 1})")
                
                if attempt == max_retries:
                    raise AgentError(error_msg, agent_name, "TIMEOUT")
                    
            except Exception as e:
                error_msg = f"{agent_name} agent failed: {str(e)}"
                logger.warning(f"{error_msg} (attempt {attempt + 1}/{max_retries + 1})")
                
                if attempt == max_retries:
                    raise AgentError(error_msg, agent_name, "EXECUTION_ERROR", str(e))
                
                # Wait before retry (exponential backoff)
                await asyncio.sleep(2 ** attempt)
        
        # This should never be reached, but just in case
        raise AgentError(f"{agent_name} agent failed after {max_retries + 1} attempts", agent_name, "MAX_RETRIES")
    
    async def _execute_agent(self, prompt: str) -> str:
        """Run the prompt through Gemini via LangChain and return the text response."""
        try:
            # agenerate returns an LCAsyncRunner object; we extract the first generation’s text
            response = await self.model.agenerate(prompts=[prompt])
            return response.generations[0][0].text
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")
            raise
    
    def _prepare_prompt(self, prompt: str, input_data: Any = None) -> str:
        """Prepare the full prompt with input data if provided."""
        if input_data is None:
            return prompt
        
        if isinstance(input_data, str):
            return f"{prompt}\n\nInput Data:\n{input_data}"
        elif isinstance(input_data, dict):
            input_str = "\n".join([f"{k}: {v}" for k, v in input_data.items()])
            return f"{prompt}\n\nInput Data:\n{input_str}"
        else:
            return f"{prompt}\n\nInput Data:\n{str(input_data)}"
    
    async def run_multiple_agents(
        self,
        agent_configs: List[Dict[str, Any]],
        max_concurrent: int = 3
    ) -> Dict[str, Any]:
        """
        Run multiple agents concurrently with controlled concurrency.
        
        Args:
            agent_configs: List of agent configurations
            max_concurrent: Maximum number of concurrent agents
            
        Returns:
            Dictionary mapping agent names to their results
        """
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def run_single_agent(config):
            async with semaphore:
                return await self.run_agent_async(**config)
        
        tasks = [run_single_agent(config) for config in agent_configs]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        agent_results = {}
        for i, result in enumerate(results):
            agent_name = agent_configs[i].get("agent_name", f"agent_{i}")
            
            if isinstance(result, Exception):
                agent_results[agent_name] = {
                    "success": False,
                    "error": str(result),
                    "agent_name": agent_name
                }
            else:
                agent_results[agent_name] = result
        
        return agent_results

class AgentError(Exception):
    """Custom exception for agent-related errors."""
    
    def __init__(self, message: str, agent_name: str, error_type: str, details: str = None):
        self.message = message
        self.agent_name = agent_name
        self.error_type = error_type
        self.details = details
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert error to dictionary for API responses."""
        return {
            "error": self.message,
            "agent_name": self.agent_name,
            "error_type": self.error_type,
            "details": self.details
        }

# Global agent runner instance
agent_runner = AgentRunner()

# Convenience functions
async def run_agent(agent_name: str, prompt: str, input_data: Any = None, **kwargs) -> Dict[str, Any]:
    """Convenience function to run a single agent."""
    return await agent_runner.run_agent_async(agent_name, prompt, input_data, **kwargs)

async def run_agents(agent_configs: List[Dict[str, Any]], **kwargs) -> Dict[str, Any]:
    """Convenience function to run multiple agents."""
    return await agent_runner.run_multiple_agents(agent_configs, **kwargs)
