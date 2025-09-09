"""
Database Schema for AI Startup Investment Analysis Platform
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Startup(Base):
    """Startup company information"""
    __tablename__ = 'startups'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    website = Column(String(255))
    founded_year = Column(Integer)
    headquarters = Column(String(255))
    sector = Column(String(100))  # Technology, Healthcare, Fintech, etc.
    business_model = Column(String(100))  # B2B, B2C, Marketplace, SaaS, etc.
    stage = Column(String(50))  # Pre-seed, Seed, Series A, etc.
    funding_raised = Column(Float)  # Total funding in USD
    last_valuation = Column(Float)  # Last known valuation in USD
    employee_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    documents = relationship("StartupDocument", back_populates="startup")
    analyses = relationship("StartupAnalysis", back_populates="startup")
    market_trends = relationship("MarketTrend", back_populates="startup")

class StartupDocument(Base):
    """Documents uploaded for startup analysis"""
    __tablename__ = 'startup_documents'
    
    id = Column(Integer, primary_key=True)
    startup_id = Column(Integer, ForeignKey('startups.id'))
    document_type = Column(String(50))  # pitch_deck, email, call_transcript, etc.
    filename = Column(String(255))
    file_path = Column(String(500))
    file_size = Column(Integer)
    upload_date = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)
    
    # Relationships
    startup = relationship("Startup", back_populates="documents")

class MarketTrend(Base):
    """Market trend data for different time periods"""
    __tablename__ = 'market_trends'
    
    id = Column(Integer, primary_key=True)
    startup_id = Column(Integer, ForeignKey('startups.id'))
    sector = Column(String(100))
    trend_period = Column(String(20))  # weekly, monthly, 6_monthly
    trend_date = Column(DateTime)
    trend_score = Column(Float)  # 0-100 score
    trend_keywords = Column(JSON)  # List of trending keywords
    sentiment_score = Column(Float)  # -1 to 1 sentiment
    news_count = Column(Integer)
    market_size_growth = Column(Float)  # Percentage growth
    competitor_activity = Column(JSON)  # Competitor analysis data
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    startup = relationship("Startup", back_populates="market_trends")

class StartupAnalysis(Base):
    """Comprehensive startup analysis results"""
    __tablename__ = 'startup_analyses'
    
    id = Column(Integer, primary_key=True)
    startup_id = Column(Integer, ForeignKey('startups.id'))
    analysis_date = Column(DateTime, default=datetime.utcnow)
    
    # SWOT Analysis
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    opportunities = Column(JSON)
    threats = Column(JSON)
    swot_score = Column(Float)  # 0-100
    
    # Financial Analysis
    revenue_growth_rate = Column(Float)
    burn_rate = Column(Float)
    runway_months = Column(Float)
    customer_acquisition_cost = Column(Float)
    lifetime_value = Column(Float)
    gross_margin = Column(Float)
    financial_score = Column(Float)  # 0-100
    
    # Market Analysis
    market_size = Column(Float)
    market_share = Column(Float)
    competitive_position = Column(String(50))  # leader, challenger, follower, niche
    market_score = Column(Float)  # 0-100
    
    # Team Analysis
    team_score = Column(Float)  # 0-100
    founder_experience = Column(JSON)
    key_team_members = Column(JSON)
    
    # Technology Analysis
    tech_innovation_score = Column(Float)  # 0-100
    ip_portfolio = Column(JSON)
    tech_scalability = Column(String(50))  # high, medium, low
    
    # Risk Analysis
    risk_factors = Column(JSON)
    risk_score = Column(Float)  # 0-100 (higher = more risky)
    red_flags = Column(JSON)
    
    # Trend Alignment
    trend_alignment_score = Column(Float)  # 0-100
    trend_alignment_details = Column(JSON)
    
    # Overall Investment Score
    overall_score = Column(Float)  # 0-100
    investment_recommendation = Column(String(50))  # strong_buy, buy, hold, avoid
    confidence_level = Column(Float)  # 0-100
    
    # Relationships
    startup = relationship("Startup", back_populates="analyses")

class BenchmarkData(Base):
    """Benchmark data for different sectors and stages"""
    __tablename__ = 'benchmark_data'
    
    id = Column(Integer, primary_key=True)
    sector = Column(String(100))
    stage = Column(String(50))
    metric_name = Column(String(100))  # revenue_growth, burn_rate, etc.
    metric_value = Column(Float)
    percentile_25 = Column(Float)
    percentile_50 = Column(Float)
    percentile_75 = Column(Float)
    percentile_90 = Column(Float)
    data_source = Column(String(100))
    last_updated = Column(DateTime, default=datetime.utcnow)

class NewsArticle(Base):
    """News articles for market trend analysis"""
    __tablename__ = 'news_articles'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(500))
    content = Column(Text)
    source = Column(String(100))
    url = Column(String(1000))
    published_date = Column(DateTime)
    sector = Column(String(100))
    sentiment_score = Column(Float)  # -1 to 1
    relevance_score = Column(Float)  # 0-1
    keywords = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class InvestmentScore(Base):
    """Investment scoring with customizable weightages"""
    __tablename__ = 'investment_scores'
    
    id = Column(Integer, primary_key=True)
    startup_id = Column(Integer, ForeignKey('startups.id'))
    analysis_id = Column(Integer, ForeignKey('startup_analyses.id'))
    
    # Customizable weightages
    swot_weight = Column(Float, default=0.25)
    financial_weight = Column(Float, default=0.25)
    market_weight = Column(Float, default=0.20)
    team_weight = Column(Float, default=0.15)
    tech_weight = Column(Float, default=0.10)
    risk_weight = Column(Float, default=0.05)
    
    # Weighted scores
    weighted_swot_score = Column(Float)
    weighted_financial_score = Column(Float)
    weighted_market_score = Column(Float)
    weighted_team_score = Column(Float)
    weighted_tech_score = Column(Float)
    weighted_risk_score = Column(Float)
    
    # Final scores
    final_score = Column(Float)  # 0-100
    investment_grade = Column(String(10))  # A+, A, B+, B, C+, C, D
    recommendation = Column(String(50))  # strong_buy, buy, hold, avoid
    
    created_at = Column(DateTime, default=datetime.utcnow)

class DealNote(Base):
    """Generated deal notes for investors"""
    __tablename__ = 'deal_notes'
    
    id = Column(Integer, primary_key=True)
    startup_id = Column(Integer, ForeignKey('startups.id'))
    analysis_id = Column(Integer, ForeignKey('startup_analyses.id'))
    
    executive_summary = Column(Text)
    investment_thesis = Column(Text)
    key_metrics = Column(JSON)
    competitive_analysis = Column(Text)
    risk_assessment = Column(Text)
    financial_projections = Column(JSON)
    recommendation = Column(Text)
    next_steps = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)

# Indexes for better performance
from sqlalchemy import Index

# Add indexes
Index('idx_startup_sector', Startup.sector)
Index('idx_startup_stage', Startup.stage)
Index('idx_market_trend_sector', MarketTrend.sector)
Index('idx_market_trend_period', MarketTrend.trend_period)
Index('idx_analysis_date', StartupAnalysis.analysis_date)
Index('idx_news_sector', NewsArticle.sector)
Index('idx_news_published_date', NewsArticle.published_date)


