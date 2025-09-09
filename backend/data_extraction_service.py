import re
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from database_models import (
    Startup, StartupDocument, StartupAnalysis, ExtractedData, 
    FinancialMetrics, TeamMembers, MarketData, Competitors
)

class DataExtractionService:
    """Service to extract and save structured data from analysis results"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def save_startup_analysis(self, analysis_result: Dict[str, Any], 
                            startup_name: str = None, 
                            document_filename: str = None) -> int:
        """Save complete analysis result to database"""
        
        # Extract or create startup
        startup_id = self._get_or_create_startup(analysis_result, startup_name)
        
        # Create document record if applicable
        document_id = None
        if document_filename and analysis_result.get('file_path'):
            document_id = self._create_document_record(
                startup_id, analysis_result, document_filename
            )
        
        # Save main analysis
        analysis_id = self._save_analysis_record(
            startup_id, document_id, analysis_result
        )
        
        # Extract and save structured data
        self._extract_structured_data(startup_id, document_id, analysis_result)
        
        return analysis_id
    
    def _get_or_create_startup(self, analysis_result: Dict[str, Any], 
                              startup_name: str = None) -> int:
        """Get existing startup or create new one"""
        
        # Try to extract startup name from analysis
        if not startup_name:
            startup_name = self._extract_startup_name(analysis_result)
        
        if not startup_name:
            startup_name = "Unknown Startup"
        
        # Check if startup already exists
        existing_startup = self.db.query(Startup).filter(
            Startup.name == startup_name
        ).first()
        
        if existing_startup:
            return existing_startup.id
        
        # Create new startup
        startup = Startup(
            name=startup_name,
            description=self._extract_description(analysis_result),
            industry=self._extract_industry(analysis_result),
            stage=self._extract_stage(analysis_result),
            location=self._extract_location(analysis_result),
            founded_year=self._extract_founded_year(analysis_result)
        )
        
        self.db.add(startup)
        self.db.commit()
        self.db.refresh(startup)
        
        return startup.id
    
    def _create_document_record(self, startup_id: int, 
                               analysis_result: Dict[str, Any], 
                               filename: str) -> int:
        """Create document record"""
        
        document = StartupDocument(
            startup_id=startup_id,
            filename=filename,
            file_path=analysis_result.get('file_path'),
            file_type=analysis_result.get('document_type', 'unknown'),
            file_size=analysis_result.get('file_size'),
            total_pages=analysis_result.get('total_pages'),
            successful_analyses=analysis_result.get('successful_analyses'),
            status=analysis_result.get('status', 'success')
        )
        
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        
        return document.id
    
    def _save_analysis_record(self, startup_id: int, document_id: int, 
                             analysis_result: Dict[str, Any]) -> int:
        """Save analysis record"""
        
        analysis = StartupAnalysis(
            startup_id=startup_id,
            document_id=document_id,
            analysis_type=analysis_result.get('document_type', 'unknown'),
            analysis_data=analysis_result,
            status=analysis_result.get('status', 'success'),
            confidence_score=self._calculate_confidence_score(analysis_result),
            processing_time=self._calculate_processing_time(analysis_result)
        )
        
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        return analysis.id
    
    def _extract_structured_data(self, startup_id: int, document_id: int, 
                                analysis_result: Dict[str, Any]):
        """Extract and save structured data from analysis"""
        
        # Extract financial metrics
        self._extract_financial_metrics(startup_id, document_id, analysis_result)
        
        # Extract team members
        self._extract_team_members(startup_id, document_id, analysis_result)
        
        # Extract market data
        self._extract_market_data(startup_id, document_id, analysis_result)
        
        # Extract competitors
        self._extract_competitors(startup_id, document_id, analysis_result)
        
        # Extract general data
        self._extract_general_data(startup_id, document_id, analysis_result)
    
    def _extract_financial_metrics(self, startup_id: int, document_id: int, 
                                  analysis_result: Dict[str, Any]):
        """Extract financial metrics from analysis"""
        
        text_content = self._get_text_content(analysis_result)
        
        # Common financial metrics patterns
        financial_patterns = {
            'MRR': r'MRR[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?',
            'ARR': r'ARR[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?',
            'Revenue': r'[Rr]evenue[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?',
            'CAC': r'CAC[:\s]*\$?([0-9,]+(?:\.\d+)?)',
            'LTV': r'LTV[:\s]*\$?([0-9,]+(?:\.\d+)?)',
            'Burn Rate': r'[Bb]urn\s+[Rr]ate[:\s]*\$?([0-9,]+(?:\.\d+)?)',
            'Runway': r'[Rr]unway[:\s]*([0-9,]+(?:\.\d+)?)\s*(?:months?|years?)',
            'Valuation': r'[Vv]aluation[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?'
        }
        
        for metric_name, pattern in financial_patterns.items():
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            for match in matches:
                value = self._parse_numeric_value(match)
                if value:
                    financial_metric = FinancialMetrics(
                        startup_id=startup_id,
                        document_id=document_id,
                        metric_name=metric_name,
                        metric_value=value,
                        metric_unit='USD',
                        confidence=0.8
                    )
                    self.db.add(financial_metric)
        
        self.db.commit()
    
    def _extract_team_members(self, startup_id: int, document_id: int, 
                             analysis_result: Dict[str, Any]):
        """Extract team members from analysis"""
        
        text_content = self._get_text_content(analysis_result)
        
        # Look for team member patterns
        team_patterns = [
            r'([A-Z][a-z]+\s+[A-Z][a-z]+)[:\s]*(?:CEO|CTO|COO|Founder|Co-founder)',
            r'(?:CEO|CTO|COO|Founder|Co-founder)[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)',
            r'([A-Z][a-z]+\s+[A-Z][a-z]+)[:\s]*(?:VP|Director|Manager)',
        ]
        
        for pattern in team_patterns:
            matches = re.findall(pattern, text_content)
            for name in matches:
                if len(name.split()) >= 2:  # Ensure it's a full name
                    team_member = TeamMembers(
                        startup_id=startup_id,
                        document_id=document_id,
                        name=name.strip(),
                        is_founder='founder' in pattern.lower()
                    )
                    self.db.add(team_member)
        
        self.db.commit()
    
    def _extract_market_data(self, startup_id: int, document_id: int, 
                            analysis_result: Dict[str, Any]):
        """Extract market data from analysis"""
        
        text_content = self._get_text_content(analysis_result)
        
        # Market size patterns
        market_patterns = {
            'TAM': r'TAM[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?',
            'SAM': r'SAM[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?',
            'SOM': r'SOM[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?',
            'Market Size': r'[Mm]arket\s+[Ss]ize[:\s]*\$?([0-9,]+(?:\.\d+)?)[KMB]?'
        }
        
        for data_type, pattern in market_patterns.items():
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            for match in matches:
                value = self._parse_numeric_value(match)
                if value:
                    market_data = MarketData(
                        startup_id=startup_id,
                        document_id=document_id,
                        data_type=data_type,
                        value=value,
                        unit='USD',
                        confidence=0.8
                    )
                    self.db.add(market_data)
        
        self.db.commit()
    
    def _extract_competitors(self, startup_id: int, document_id: int, 
                            analysis_result: Dict[str, Any]):
        """Extract competitors from analysis"""
        
        text_content = self._get_text_content(analysis_result)
        
        # Competitor patterns
        competitor_patterns = [
            r'[Cc]ompetitor[s]?[:\s]*([A-Z][a-zA-Z\s&]+)',
            r'[Cc]ompeting\s+with[:\s]*([A-Z][a-zA-Z\s&]+)',
            r'[Aa]lternative[s]?[:\s]*([A-Z][a-zA-Z\s&]+)'
        ]
        
        for pattern in competitor_patterns:
            matches = re.findall(pattern, text_content)
            for competitor_name in matches:
                competitor_name = competitor_name.strip()
                if len(competitor_name) > 2:  # Filter out short matches
                    competitor = Competitors(
                        startup_id=startup_id,
                        document_id=document_id,
                        competitor_name=competitor_name
                    )
                    self.db.add(competitor)
        
        self.db.commit()
    
    def _extract_general_data(self, startup_id: int, document_id: int, 
                             analysis_result: Dict[str, Any]):
        """Extract general structured data"""
        
        text_content = self._get_text_content(analysis_result)
        
        # Extract various data points
        data_categories = {
            'customer_count': r'([0-9,]+)\s*(?:customers?|users?)',
            'team_size': r'([0-9,]+)\s*(?:people|employees?|team\s+members?)',
            'growth_rate': r'([0-9,]+(?:\.\d+)?)%\s*(?:growth|increase)',
            'churn_rate': r'([0-9,]+(?:\.\d+)?)%\s*(?:churn|retention)'
        }
        
        for category, pattern in data_categories.items():
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            for match in matches:
                value = self._parse_numeric_value(match)
                if value:
                    extracted_data = ExtractedData(
                        startup_id=startup_id,
                        document_id=document_id,
                        data_type='general',
                        data_category=category,
                        data_value=str(value),
                        confidence=0.7
                    )
                    self.db.add(extracted_data)
        
        self.db.commit()
    
    def _get_text_content(self, analysis_result: Dict[str, Any]) -> str:
        """Extract text content from analysis result"""
        
        text_parts = []
        
        # Get overall summary
        if analysis_result.get('overall_summary'):
            text_parts.append(analysis_result['overall_summary'])
        
        # Get page analyses
        if analysis_result.get('page_analyses'):
            for page in analysis_result['page_analyses']:
                if page.get('analysis'):
                    text_parts.append(page['analysis'])
        
        # Get direct analysis
        if analysis_result.get('analysis'):
            text_parts.append(analysis_result['analysis'])
        
        return ' '.join(text_parts)
    
    def _parse_numeric_value(self, value_str: str) -> Optional[float]:
        """Parse numeric value from string"""
        try:
            # Remove commas and convert K/M/B suffixes
            value_str = value_str.replace(',', '')
            
            if value_str.endswith('K'):
                return float(value_str[:-1]) * 1000
            elif value_str.endswith('M'):
                return float(value_str[:-1]) * 1000000
            elif value_str.endswith('B'):
                return float(value_str[:-1]) * 1000000000
            else:
                return float(value_str)
        except:
            return None
    
    def _extract_startup_name(self, analysis_result: Dict[str, Any]) -> Optional[str]:
        """Extract startup name from analysis"""
        text_content = self._get_text_content(analysis_result)
        
        # Look for company name patterns
        name_patterns = [
            r'[Cc]ompany[:\s]*([A-Z][a-zA-Z\s&]+)',
            r'[Ss]tartup[:\s]*([A-Z][a-zA-Z\s&]+)',
            r'[Bb]usiness[:\s]*([A-Z][a-zA-Z\s&]+)'
        ]
        
        for pattern in name_patterns:
            matches = re.findall(pattern, text_content)
            if matches:
                return matches[0].strip()
        
        return None
    
    def _extract_description(self, analysis_result: Dict[str, Any]) -> Optional[str]:
        """Extract description from analysis"""
        text_content = self._get_text_content(analysis_result)
        
        # Look for description patterns
        desc_patterns = [
            r'[Dd]escription[:\s]*([^.]{50,200})',
            r'[Oo]verview[:\s]*([^.]{50,200})',
            r'[Aa]bout[:\s]*([^.]{50,200})'
        ]
        
        for pattern in desc_patterns:
            matches = re.findall(pattern, text_content)
            if matches:
                return matches[0].strip()
        
        return None
    
    def _extract_industry(self, analysis_result: Dict[str, Any]) -> Optional[str]:
        """Extract industry from analysis"""
        text_content = self._get_text_content(analysis_result)
        
        # Common industry keywords
        industries = [
            'fintech', 'healthtech', 'edtech', 'saas', 'ecommerce',
            'ai', 'machine learning', 'blockchain', 'cybersecurity',
            'biotech', 'cleantech', 'agtech', 'proptech'
        ]
        
        for industry in industries:
            if industry.lower() in text_content.lower():
                return industry.title()
        
        return None
    
    def _extract_stage(self, analysis_result: Dict[str, Any]) -> Optional[str]:
        """Extract funding stage from analysis"""
        text_content = self._get_text_content(analysis_result)
        
        stages = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth']
        
        for stage in stages:
            if stage.lower() in text_content.lower():
                return stage
        
        return None
    
    def _extract_location(self, analysis_result: Dict[str, Any]) -> Optional[str]:
        """Extract location from analysis"""
        text_content = self._get_text_content(analysis_result)
        
        # Look for location patterns
        location_patterns = [
            r'[Ll]ocation[:\s]*([A-Z][a-zA-Z\s,]+)',
            r'[Bb]ased\s+in[:\s]*([A-Z][a-zA-Z\s,]+)',
            r'[Hh]eadquarters[:\s]*([A-Z][a-zA-Z\s,]+)'
        ]
        
        for pattern in location_patterns:
            matches = re.findall(pattern, text_content)
            if matches:
                return matches[0].strip()
        
        return None
    
    def _extract_founded_year(self, analysis_result: Dict[str, Any]) -> Optional[int]:
        """Extract founded year from analysis"""
        text_content = self._get_text_content(analysis_result)
        
        # Look for founded year patterns
        year_patterns = [
            r'[Ff]ounded[:\s]*([0-9]{4})',
            r'[Ee]stablished[:\s]*([0-9]{4})',
            r'[Ss]tarted[:\s]*([0-9]{4})'
        ]
        
        for pattern in year_patterns:
            matches = re.findall(pattern, text_content)
            if matches:
                try:
                    return int(matches[0])
                except:
                    continue
        
        return None
    
    def _calculate_confidence_score(self, analysis_result: Dict[str, Any]) -> float:
        """Calculate confidence score for analysis"""
        # Simple confidence calculation based on analysis completeness
        score = 0.5  # Base score
        
        if analysis_result.get('overall_summary'):
            score += 0.2
        
        if analysis_result.get('page_analyses'):
            successful_pages = analysis_result.get('successful_analyses', 0)
            total_pages = analysis_result.get('total_pages', 1)
            score += 0.3 * (successful_pages / total_pages)
        
        return min(score, 1.0)
    
    def _calculate_processing_time(self, analysis_result: Dict[str, Any]) -> Optional[float]:
        """Calculate processing time if available"""
        # This would need to be implemented based on how you track processing time
        return None
