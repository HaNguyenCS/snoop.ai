import json
import os
import re
from typing import Any, Dict, List

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing. Add it to your .env file.")

client = Groq(api_key=GROQ_API_KEY)

GROQ_MODEL = "llama-3.1-8b-instant"


def _extract_json_object(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", text, flags=re.DOTALL)

    if not match:
        raise ValueError("Groq response did not contain valid JSON.")

    return json.loads(match.group(0))


def suggest_competitors_with_ai(
    company_name: str,
    industry: str,
    product_description: str,
) -> List[str]:
    system_prompt = """
You are a strict JSON generator for a backend service.
Return only valid JSON. No markdown. No explanation.
"""

    user_prompt = f"""
Suggest competitors for a company monitoring tool.

Company:
{company_name}

Industry:
{industry}

Product description:
{product_description}

Rules:
- Return 5 to 10 real likely competitors.
- Just 1 word name company, most common version of names that people normal refer to the company or product as. Avoid formal names with "Inc", "Group", etc.
- The array must NOT be empty.
- Include direct competitors first.
- Use most commonly used company or product names.
- Avoid formal, uncommonly used full company name (example: bmw "group"
- Do not include explanations.
- Do not include the user's company itself.
- Avoid duplicates.
- Do not copy the schema with an empty array.
Return only valid JSON.

For example, if the company is DoorDash, good competitors may include:
Uber Eats, Instacart, Grubhub, SkipTheDishes.

JSON format:
{{
  "suggested_competitors": ["Competitor 1", "Competitor 2", "Competitor 3"]
}}
"""

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        model=GROQ_MODEL,
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    text = chat_completion.choices[0].message.content

    # Debug: check terminal after calling the endpoint
    print("GROQ RAW RESPONSE:", text)

    result = _extract_json_object(text)

    competitors = (
        result.get("suggested_competitors")
        or result.get("competitors")
        or result.get("direct_competitors")
        or []
    )

    cleaned = []

    for competitor in competitors:
        if isinstance(competitor, str):
            competitor = competitor.strip()

            if competitor and competitor.lower() != company_name.lower():
                cleaned.append(competitor)

    return sorted(set(cleaned))[:10]