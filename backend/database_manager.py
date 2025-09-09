#!/usr/bin/env python3
"""
Database management script for the startup analysis platform
"""

import os
import sys
from sqlalchemy import create_engine, text
from database_models import Base, engine, SessionLocal
from data_extraction_service import DataExtractionService

def create_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def drop_database():
    """Drop all database tables"""
    print("Dropping database tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Database tables dropped successfully!")

def reset_database():
    """Reset database by dropping and recreating all tables"""
    print("Resetting database...")
    drop_database()
    create_database()
    print("✅ Database reset successfully!")

def show_stats():
    """Show database statistics"""
    db = SessionLocal()
    try:
        from database_models import Startup, StartupDocument, StartupAnalysis, FinancialMetrics, TeamMembers, MarketData, Competitors
        
        print("\n📊 Database Statistics:")
        print("=" * 50)
        
        # Count records
        startup_count = db.query(Startup).count()
        document_count = db.query(StartupDocument).count()
        analysis_count = db.query(StartupAnalysis).count()
        financial_count = db.query(FinancialMetrics).count()
        team_count = db.query(TeamMembers).count()
        market_count = db.query(MarketData).count()
        competitor_count = db.query(Competitors).count()
        
        print(f"Startups: {startup_count}")
        print(f"Documents: {document_count}")
        print(f"Analyses: {analysis_count}")
        print(f"Financial Metrics: {financial_count}")
        print(f"Team Members: {team_count}")
        print(f"Market Data: {market_count}")
        print(f"Competitors: {competitor_count}")
        
        # Show recent startups
        if startup_count > 0:
            print(f"\n📋 Recent Startups:")
            print("-" * 30)
            recent_startups = db.query(Startup).order_by(Startup.created_at.desc()).limit(5).all()
            for startup in recent_startups:
                print(f"• {startup.name} ({startup.industry or 'Unknown'}) - {startup.created_at.strftime('%Y-%m-%d %H:%M')}")
        
        # Show analysis types
        if analysis_count > 0:
            print(f"\n🔍 Analysis Types:")
            print("-" * 30)
            from sqlalchemy import func
            analysis_types = db.query(StartupAnalysis.analysis_type, func.count(StartupAnalysis.id)).group_by(StartupAnalysis.analysis_type).all()
            for analysis_type, count in analysis_types:
                print(f"• {analysis_type}: {count}")
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")
    finally:
        db.close()

def export_data():
    """Export data to JSON files"""
    db = SessionLocal()
    try:
        import json
        from datetime import datetime
        from database_models import Startup, StartupDocument, StartupAnalysis, FinancialMetrics, TeamMembers, MarketData, Competitors
        
        print("Exporting data to JSON files...")
        
        # Create export directory
        export_dir = "database_exports"
        os.makedirs(export_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Export startups
        startups = db.query(Startup).all()
        startup_data = []
        for startup in startups:
            startup_data.append({
                "id": startup.id,
                "name": startup.name,
                "description": startup.description,
                "industry": startup.industry,
                "stage": startup.stage,
                "location": startup.location,
                "founded_year": startup.founded_year,
                "created_at": startup.created_at.isoformat() if startup.created_at else None,
                "updated_at": startup.updated_at.isoformat() if startup.updated_at else None
            })
        
        with open(f"{export_dir}/startups_{timestamp}.json", "w") as f:
            json.dump(startup_data, f, indent=2)
        
        # Export financial metrics
        metrics = db.query(FinancialMetrics).all()
        metrics_data = []
        for metric in metrics:
            metrics_data.append({
                "id": metric.id,
                "startup_id": metric.startup_id,
                "metric_name": metric.metric_name,
                "metric_value": metric.metric_value,
                "metric_unit": metric.metric_unit,
                "time_period": metric.time_period,
                "is_projection": metric.is_projection,
                "confidence": metric.confidence,
                "created_at": metric.created_at.isoformat() if metric.created_at else None
            })
        
        with open(f"{export_dir}/financial_metrics_{timestamp}.json", "w") as f:
            json.dump(metrics_data, f, indent=2)
        
        print(f"✅ Data exported to {export_dir}/")
        
    except Exception as e:
        print(f"❌ Error exporting data: {e}")
    finally:
        db.close()

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python database_manager.py <command>")
        print("Commands:")
        print("  create    - Create database tables")
        print("  drop      - Drop database tables")
        print("  reset     - Reset database (drop and create)")
        print("  stats     - Show database statistics")
        print("  export    - Export data to JSON files")
        return
    
    command = sys.argv[1].lower()
    
    if command == "create":
        create_database()
    elif command == "drop":
        drop_database()
    elif command == "reset":
        reset_database()
    elif command == "stats":
        show_stats()
    elif command == "export":
        export_data()
    else:
        print(f"Unknown command: {command}")
        print("Available commands: create, drop, reset, stats, export")

if __name__ == "__main__":
    main()
