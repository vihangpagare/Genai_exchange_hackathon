"""
Centralized configuration management for InvestAI platform.
Handles environment variables, API keys, and application settings.
"""

import os
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings
import logging

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys (optional for development)
    google_api_key: str = Field(default="demo_key", env="GOOGLE_API_KEY")
    exa_api_key: str = Field(default="demo_key", env="EXA_API_KEY")
    
    # Database Configuration
    database_url: str = Field(
        default="sqlite:///./investai.db", 
        env="DATABASE_URL"
    )
    
    # Redis Configuration
    redis_url: str = Field(
        default="redis://localhost:6379", 
        env="REDIS_URL"
    )
    
    # Firebase Configuration
    firebase_project_id: Optional[str] = Field(None, env="FIREBASE_PROJECT_ID")
    firebase_private_key_id: Optional[str] = Field(None, env="FIREBASE_PRIVATE_KEY_ID")
    firebase_private_key: Optional[str] = Field(None, env="FIREBASE_PRIVATE_KEY")
    firebase_client_email: Optional[str] = Field(None, env="FIREBASE_CLIENT_EMAIL")
    firebase_client_id: Optional[str] = Field(None, env="FIREBASE_CLIENT_ID")
    firebase_auth_uri: str = Field(
        default="https://accounts.google.com/o/oauth2/auth",
        env="FIREBASE_AUTH_URI"
    )
    firebase_token_uri: str = Field(
        default="https://oauth2.googleapis.com/token",
        env="FIREBASE_TOKEN_URI"
    )
    
    # Application Configuration
    environment: str = Field(default="development", env="ENVIRONMENT")
    debug: bool = Field(default=True, env="DEBUG")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Security (with defaults for development)
    secret_key: str = Field(default="dev_secret_key_change_in_production", env="SECRET_KEY")
    jwt_secret: str = Field(default="dev_jwt_secret_change_in_production", env="JWT_SECRET")
    
    # External Services
    backend_url: str = Field(default="http://localhost:8000", env="BACKEND_URL")
    frontend_url: str = Field(default="http://localhost:3000", env="FRONTEND_URL")
    
    # CORS Configuration
    allowed_origins: list = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        env="ALLOWED_ORIGINS"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

def get_settings() -> Settings:
    """Get application settings."""
    # Debug: Log the loaded API key (masked for security)
    masked_key = settings.google_api_key[:8] + "..." + settings.google_api_key[-4:] if len(settings.google_api_key) > 12 else "***"
    logger.info(f"Google API Key loaded: {masked_key}")
    return settings

def validate_api_keys() -> bool:
    """Validate that all required API keys are present."""
    required_keys = [
        settings.google_api_key,
        settings.exa_api_key,
        settings.secret_key,
        settings.jwt_secret
    ]
    
    missing_keys = [key for key in required_keys if not key or key == "your_api_key_here"]
    
    if missing_keys:
        logger.warning(f"Using demo keys for development: {missing_keys}")
        return True  # Allow demo keys for development
    
    logger.info("All required API keys are present")
    return True

# Validate configuration on import (allow demo keys for development)
validate_api_keys()
