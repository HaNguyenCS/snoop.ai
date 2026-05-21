from typing import Dict, List


MAX_KEYWORDS = 30


def normalize_keyword(text: str) -> str:
    return " ".join(text.strip().lower().split())


def dedupe_and_cap(keywords: List[str], max_keywords: int = MAX_KEYWORDS) -> List[str]:
    cleaned = []

    for keyword in keywords:
        if not isinstance(keyword, str):
            continue

        keyword = normalize_keyword(keyword)

        if not keyword:
            continue

        cleaned.append(keyword)

    return sorted(set(cleaned))[:max_keywords]


def generate_keywords(
    company_name: str,
    industry: str,
    product_description: str,
    competitors: List[str],
) -> Dict:
    competitor_keywords = dedupe_and_cap(competitors)

    return {
        "source_profile": {
            "company_name": company_name,
            "industry": industry,
            "product_description": product_description,
            "competitors": competitors,
        },
        "keyword_groups": {
            "competitors": competitor_keywords,
        },
        "all_keywords": competitor_keywords,
        "keyword_count": len(competitor_keywords),
        "generation_method": "competitors_only",
    }