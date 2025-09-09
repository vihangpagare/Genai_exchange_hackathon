from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./startup_analysis.db")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Startup(Base):
    """Main startup entity"""
    __tablename__ = "startups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    website = Column(String(255))
    industry = Column(String(100))
    stage = Column(String(50))  # pre-seed, seed, series-a, etc.
    location = Column(String(100))
    founded_year = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    documents = relationship("StartupDocument", back_populates="startup")
    analyses = relationship("StartupAnalysis", back_populates="startup")

class StartupDocument(Base):
    """Documents uploaded for analysis"""
    __tablename__ = "startup_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500))
    file_type = Column(String(50))  # pdf, pptx, ppt, email, call
    file_size = Column(Integer)
    total_pages = Column(Integer)
    successful_analyses = Column(Integer)
    status = Column(String(50))  # success, failed, processing
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup", back_populates="documents")
    analyses = relationship("StartupAnalysis", back_populates="document")

class StartupAnalysis(Base):
    """Analysis results for startups"""
    __tablename__ = "startup_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("startup_documents.id"), nullable=True)
    analysis_type = Column(String(50), nullable=False)  # document, email, call, business_model, market_intelligence, risk_assessment, fact_check, comprehensive
    analysis_data = Column(JSON)  # Store the full analysis result
    status = Column(String(50))  # success, failed, processing
    confidence_score = Column(Float)  # 0-1 confidence in the analysis
    processing_time = Column(Float)  # Time taken in seconds
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup", back_populates="analyses")
    document = relationship("StartupDocument", back_populates="analyses")

class ExtractedData(Base):
    """Structured data extracted from documents"""
    __tablename__ = "extracted_data"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("startup_documents.id"), nullable=True)
    data_type = Column(String(50), nullable=False)  # financial, team, market, product, etc.
    data_category = Column(String(100))  # revenue, team_size, market_size, etc.
    data_value = Column(Text)
    data_unit = Column(String(50))  # USD, percentage, count, etc.
    data_source = Column(String(100))  # page_number, slide_number, etc.
    confidence = Column(Float)  # 0-1 confidence in the extracted data
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup")

class FinancialMetrics(Base):
    """Financial metrics extracted from documents"""
    __tablename__ = "financial_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("startup_documents.id"), nullable=True)
    metric_name = Column(String(100), nullable=False)  # MRR, ARR, CAC, LTV, etc.
    metric_value = Column(Float)
    metric_unit = Column(String(50))  # USD, percentage, etc.
    time_period = Column(String(50))  # monthly, quarterly, yearly
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    is_projection = Column(Boolean, default=False)
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup")

class TeamMembers(Base):
    """Team members extracted from documents"""
    __tablename__ = "team_members"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("startup_documents.id"), nullable=True)
    name = Column(String(255), nullable=False)
    title = Column(String(100))
    role = Column(String(100))  # founder, co-founder, employee, advisor, etc.
    background = Column(Text)
    previous_companies = Column(Text)
    education = Column(Text)
    years_experience = Column(Integer)
    is_founder = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup")

class MarketData(Base):
    """Market data extracted from documents"""
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("startup_documents.id"), nullable=True)
    data_type = Column(String(50), nullable=False)  # TAM, SAM, SOM, market_size, etc.
    value = Column(Float)
    unit = Column(String(50))  # USD, percentage, etc.
    time_period = Column(String(50))
    source = Column(String(255))
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup")

class Competitors(Base):
    """Competitors mentioned in documents"""
    __tablename__ = "competitors"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("startup_documents.id"), nullable=True)
    competitor_name = Column(String(255), nullable=False)
    description = Column(Text)
    market_share = Column(Float)
    competitive_advantage = Column(Text)
    threat_level = Column(String(50))  # high, medium, low
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup")

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
