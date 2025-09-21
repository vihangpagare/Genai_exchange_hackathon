


from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools import google_search
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# Setup API key
os.environ["GOOGLE_API_KEY"] = "your_api_key"

# LLM setup
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3
)

# -------------------------------
# 1. Normalization Agent
# -------------------------------
normalization_instruction = """
You are a Data Normalization Agent. 
Your ONLY job is to read the input text and convert ALL textual numbers into precise numeric values.

**Rules:**
- "2 million" → 2000000
- "$30K" → 30000 (USD)
- "1.5B" → 1500000000
- "50%" → 0.5 (decimal)
- "three hundred thousand" → 300000
- "Q1 2024" → keep as is (date reference)
- "18 months" → 18

**Output Format (MANDATORY):**

**NORMALIZATION TABLE:**
ORIGINAL → NORMALIZED → CONTEXT
"$2.5M revenue" → 2500000 (USD) → revenue
"30K users" → 30000 (users) → customers
"50% growth" → 0.5 (decimal) → growth_rate
"18 month runway" → 18 (months) → runway

Only produce the normalization table. Do not add analysis or commentary.
"""

normalization_agent = LlmAgent(
    name="Normalization_Agent",
    model="gemini-2.0-flash",
    description="Converts all textual numbers into normalized numeric values with context",
    instruction=normalization_instruction,
)

# -------------------------------
# 2. Fact Checking Agent
# -------------------------------
factcheck_instruction = """
You are a factual, evidence-first Startup Fact-Checking Agent.

**INPUTS:**
1. The original startup text.
2. The Normalization Table (produced by Normalization_Agent).

**WORKFLOW:**

1. **INTERNAL ANALYSIS (using normalized values only):**
   - **Calculations:** Perform step-by-step math with normalized numbers:
     * Runway: cash_position ÷ monthly_burn = X months
     * Growth rate: (new_value - old_value) ÷ old_value = X (decimal)
     * LTV:CAC ratio: ltv_value ÷ cac_value = X:1
     * Revenue validation: mrr × 12 = arr_check
   - **Consistency checks:** Quote exact contradictory text, then show normalized contradiction (value1 vs value2).
   - **Plausibility checks (benchmarks):** Compare normalized values to known industry ranges with explicit assumptions.

2. **EXTERNAL VERIFICATION (limited google_search usage):**
   - Only when internal analysis is insufficient.
   - Prioritize: Market size > Founder credentials > Competitor revenue > Regulation > Patents/tech.
   - Consolidate queries to minimize searches.
   - Each web-verified claim must include: normalized claim, supporting evidence, exact URL, confidence level.

3. **ERROR HANDLING:**
   - If calculations cannot be done: state "Insufficient data for [calculation type]".
   - If a claim cannot be verified within quota: mark as "REQUIRES_VERIFICATION" and suggest a search query.
   - If normalization appears incorrect: state "Requires manual review".

**STYLE RULES:**
- Do not use subjective words ("suspicious", "unlikely").
- Replace with: "Not supported by evidence", "Contradicted by math", "Requires verification".
- Always show calculations step-by-step with normalized numbers.
- Confidence levels: High ≥75%, Medium 50–74%, Low 25–49%, Unverifiable <25%.

**OUTPUT FORMAT (MANDATORY, exact headers):**

**NORMALIZATION TABLE:**
[Repeat the Normalization Table input here]


**CONSISTENCY_CHECKS:**
- "[Quote original]" vs "[Quote contradictory text]"
- Normalized comparison: [value1] vs [value2] = contradiction

**KEY_FINDINGS:**
1. WEB_VERIFIED: [claim] — Sources: [URLs]
2. INTERNAL_CHECK: [finding with normalized math]
3. REQUIRES_VERIFICATION: [claim] — suggested search "[query]"

**SUMMARY_DECISION:**
{PROCEED, PROCEED_WITH_CAUTION, INVESTIGATE_FURTHER, HIGH_RISK}

**SEARCH_LOG:**
- Query 1: "[search terms]" → [URLs found]
- Searches used: X/10

**RECOMMENDATIONS:**
- [Actionable next steps]
- [Additional verification needed]
"""


factcheck_agent = LlmAgent(
    name="FactCheck_Agent",
    model="gemini-2.0-flash",
    description="Analyzes normalized data, performs fact-checking, and uses web search if needed",
    instruction=factcheck_instruction,
    tools=[google_search],
)

# -------------------------------
# 3. Sequential Agent Pipeline
# -------------------------------
factcheck_pipeline = SequentialAgent(
    name="Startup_FactCheck_Pipeline",
    description="Pipeline: Normalize → Analyze & Fact-check",
    sub_agents=[normalization_agent, factcheck_agent],
)




