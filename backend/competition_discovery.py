from google.adk.agents import LlmAgent, SequentialAgent
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import requests
import json
from google.adk.tools import google_search

# Setup API keys
os.environ["GOOGLE_API_KEY"] = "your_api_key"
from exa_py import Exa
import os
# LLM setup
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)

# Simple Exa Search Tool
os.environ["EXA_API_KEY"] = '25dffdbd-a899-4202-a3a2-caf4fe6b5902'

# Initialize Exa client
exa = Exa(api_key=os.environ["EXA_API_KEY"])

def exa_search(query: str) -> str:
    """
    Perform a search using the Exa API and return formatted results.
    """
    try:
        
        
        search_response = exa.search_and_contents(
            query=query,
            type="auto",
            num_results=3,
            text=True,
            highlights=True,
            summary=True,
        )
        
        results = []
        for result in search_response.results:
            results.append({
                "title": result.title,
                "url": result.url,
                "content": result.text if result.text else "",
                "highlights": result.highlights if hasattr(result, 'highlights') else [],
                "summary": result.summary if hasattr(result, 'summary') else ""
            })
        
        return str(results)
        
    except Exception as e:
        return f"Error searching articles: {str(e)}"
# Competitor identification instruction
competitor_identification_instruction = """
You are a Competitor Identification Agent. Your job is to identify competitors from the startup information provided.

TASKS:
1. Extract any competitors explicitly mentioned in the input
2. Based on the startup's industry/product, identify 5-8 potential competitors
3. Prioritize well-known companies and direct competitors

OUTPUT FORMAT:
IDENTIFIED COMPETITORS:
1. [Competitor Name] - [Brief reason why they're a competitor]
2. [Competitor Name] - [Brief reason why they're a competitor]
3. [Competitor Name] - [Brief reason why they're a competitor]
...

Select the TOP 3 most relevant competitors for detailed research.
"""

# Enhanced deep research instruction with specific Exa queries
deep_research_instruction = """
You are a Deep Company Research Agent with access to the exa_search tool. 

RESEARCH METHODOLOGY:
For each competitor identified, you must SILENTLY conduct research using these 5 query types:

1. FOUNDERS RESEARCH: "<company_name> founders linkedin CEO founder background"
2. COMPANY BASICS: "<company_name> founded when company size employees linkedin about"  
3. BUSINESS MODEL: "<company_name> business model revenue monetization pricing how they make money"
4. PRODUCT PERFORMANCE: "<company_name> product features customers reviews performance metrics"
5. FUNDING INFORMATION: "<company_name> funding series A B C investment crunchbase raised money"

CRITICAL INSTRUCTIONS:
- Conduct ALL research FIRST using exa_search() for each query type per competitor
- DO NOT show intermediate search results or step-by-step outputs
- ONLY provide the final comprehensive report at the end
- Compile all research findings into one complete analysis

FINAL OUTPUT FORMAT - COMPREHENSIVE COMPETITOR INTELLIGENCE REPORT:

# 🔍 COMPREHENSIVE COMPETITOR ANALYSIS REPORT

## 📋 EXECUTIVE SUMMARY
[Brief overview of competitive landscape and key findings]

---

## 🏢 COMPETITOR ANALYSIS

### 1. [COMPETITOR NAME]

**👥 Founders & Leadership**
[Founder names, backgrounds, previous experience, leadership team details]

**🏢 Company Basics**  
[Founding year, employee count, company size, headquarters location]

**💼 Business Model**
[Revenue generation, pricing strategy, target customers, monetization approach]

**🚀 Product & Performance**
[Main products, key features, customer feedback, market performance]

**💰 Funding Information**
[Total funding raised, recent rounds, key investors, valuation]

**📊 Competitive Assessment**
- **Threat Level:** [High/Medium/Low]
- **Key Strengths:** [List based on research]
- **Potential Weaknesses:** [List based on research]

---

### 2. [COMPETITOR NAME]

**👥 Founders & Leadership**
[Founder names, backgrounds, previous experience, leadership team details]

**🏢 Company Basics**  
[Founding year, employee count, company size, headquarters location]

**💼 Business Model**
[Revenue generation, pricing strategy, target customers, monetization approach]

**🚀 Product & Performance**
[Main products, key features, customer feedback, market performance]

**💰 Funding Information**
[Total funding raised, recent rounds, key investors, valuation]

**📊 Competitive Assessment**
- **Threat Level:** [High/Medium/Low]
- **Key Strengths:** [List based on research]
- **Potential Weaknesses:** [List based on research]

---

[Continue for all competitors...]

## 🎯 STRATEGIC COMPETITIVE INSIGHTS

### Competitive Landscape Overview
[Analysis of the overall competitive environment]

### Key Market Trends
[Trends observed across competitors]

### Competitive Opportunities  
[Areas where the target startup can compete effectively]

### Strategic Recommendations
[Actionable recommendations based on competitive analysis]

---

REMEMBER: 
- Conduct all exa_search() queries silently first
- Only output this final comprehensive report
- No intermediate results or step-by-step outputs
- Base all analysis strictly on search findings
"""

# deep_research_instruction = """
# You are a Deep Company Research Agent with access to the googlesearch tool. 

# RESEARCH METHODOLOGY:
# For each competitor identified, you must SILENTLY conduct research using these 5 query types with googlesearch:

# 1. FOUNDERS RESEARCH: "<company_name> founders linkedin CEO founder background"
# 2. COMPANY BASICS: "<company_name> founded when company size employees linkedin about"  
# 3. BUSINESS MODEL: "<company_name> business model revenue monetization pricing how they make money"
# 4. PRODUCT PERFORMANCE: "<company_name> product features customers reviews performance metrics"
# 5. FUNDING INFORMATION: "<company_name> funding series A B C investment crunchbase raised money"

# CRITICAL INSTRUCTIONS:
# - Conduct ALL research FIRST using googlesearch() for each query type per competitor
# - DO NOT show intermediate search results or step-by-step outputs
# - ONLY provide the final comprehensive report at the end
# - Compile all research findings into one complete analysis

# FINAL OUTPUT FORMAT - COMPREHENSIVE COMPETITOR INTELLIGENCE REPORT:

# # 🔍 COMPREHENSIVE COMPETITOR ANALYSIS REPORT

# ## 📋 EXECUTIVE SUMMARY
# [Brief overview of competitive landscape and key findings]

# ---

# ## 🏢 COMPETITOR ANALYSIS

# ### 1. [COMPETITOR NAME]

# **👥 Founders & Leadership**
# [Founder names, backgrounds, previous experience, leadership team details from Google search]

# **🏢 Company Basics**  
# [Founding year, employee count, company size, headquarters location from Google search]

# **💼 Business Model**
# [Revenue generation, pricing strategy, target customers, monetization approach from Google search]

# **🚀 Product & Performance**
# [Main products, key features, customer feedback, market performance from Google search]

# **💰 Funding Information**
# [Total funding raised, recent rounds, key investors, valuation from Google search]

# **📊 Competitive Assessment**
# - **Threat Level:** [High/Medium/Low]
# - **Key Strengths:** [List based on Google search findings]
# - **Potential Weaknesses:** [List based on Google search findings]

# ---

# ### 2. [COMPETITOR NAME]

# **👥 Founders & Leadership**
# [Founder names, backgrounds, previous experience, leadership team details from Google search]

# **🏢 Company Basics**  
# [Founding year, employee count, company size, headquarters location from Google search]

# **💼 Business Model**
# [Revenue generation, pricing strategy, target customers, monetization approach from Google search]

# **🚀 Product & Performance**
# [Main products, key features, customer feedback, market performance from Google search]

# **💰 Funding Information**
# [Total funding raised, recent rounds, key investors, valuation from Google search]

# **📊 Competitive Assessment**
# - **Threat Level:** [High/Medium/Low]
# - **Key Strengths:** [List based on Google search findings]
# - **Potential Weaknesses:** [List based on Google search findings]

# ---

# [Continue for all competitors...]

# ## 🎯 STRATEGIC COMPETITIVE INSIGHTS

# ### Competitive Landscape Overview
# [Analysis of the overall competitive environment based on Google search findings]

# ### Key Market Trends
# [Trends observed across competitors from Google search data]

# ### Competitive Opportunities  
# [Areas where the target startup can compete effectively]

# ### Strategic Recommendations
# [Actionable recommendations based on comprehensive Google search analysis]

# ---

# REMEMBER: 
# - Conduct all googlesearch() queries silently first
# - Only output this final comprehensive report
# - No intermediate results or step-by-step outputs
# - Base all analysis strictly on Google search findings
# - Use specific data points, numbers, and facts found through Google search
# """

# Create agents
competitor_identification_agent = LlmAgent(
    name="CompetitorIdentification",
    model="gemini-2.0-flash", 
    description="Identifies key competitors from startup information",
    instruction=competitor_identification_instruction,
    tools=[]
)

deep_research_agent = LlmAgent(
    name="DeepCompanyResearch",
    model="gemini-2.0-flash",
    description="Conducts deep research on competitors using 5 specific Google search queries",
    instruction=deep_research_instruction,
    tools=[exa_search]
)

# Sequential agent pipeline
competitor_discovery_analyzer = SequentialAgent(
    name="CompetitorDiscoveryAnalyzer",
    description="2-stage pipeline: Competitor Identification → Deep Research with targeted Exa queries",
    sub_agents=[
        competitor_identification_agent,
        deep_research_agent
    ]
)


