from typing import Dict, List


DEFAULT_SIGNAL_WORDS = [
    "announced",
    "announcement",
    "news",
    "update",
    "release",
    "launch",
]


def clean_keyword(text: str) -> str:
    return text.strip().lower()


def generate_keywords(
    company_name: str,
    industry: str,
    product_description: str,
    competitors: List[str],
    selected_topic_ids: List[str],
    selected_topic_labels: List[str],
    selected_topic_keywords: List[str],
) -> Dict:
    competitor_keywords = []
    competitor_topic_keywords = []
    industry_topic_keywords = []

    for competitor in competitors:
        competitor_keywords.extend(
            [
                competitor,
                f"{competitor} news",
                f"{competitor} update",
                f"{competitor} announcement",
                f"{competitor} press release",
                f"{competitor} blog",
            ]
        )

        for topic_keyword in selected_topic_keywords:
            competitor_topic_keywords.extend(
                [
                    f"{competitor} {topic_keyword}",
                    f"{competitor} {topic_keyword} announcement",
                    f"{competitor} {topic_keyword} update",
                    f"{competitor} {topic_keyword} news",
                ]
            )

    for topic_keyword in selected_topic_keywords:
        industry_topic_keywords.extend(
            [
                topic_keyword,
                f"{industry} {topic_keyword}",
                f"{industry} {topic_keyword} news",
                f"{industry} {topic_keyword} trends",
                f"{industry} {topic_keyword} update",
            ]
        )

    industry_keywords = [
        industry,
        f"{industry} news",
        f"{industry} market update",
        f"{industry} trends",
        f"{industry} innovation",
    ]

    all_keywords = (
        [company_name]
        + competitor_keywords
        + competitor_topic_keywords
        + industry_keywords
        + industry_topic_keywords
        + DEFAULT_SIGNAL_WORDS
    )

    cleaned_all = sorted(
        set(clean_keyword(keyword) for keyword in all_keywords if keyword.strip())
    )

    return {
        "source_profile": {
            "company_name": company_name,
            "industry": industry,
            "product_description": product_description,
            "competitors": competitors,
            "selected_topic_ids": selected_topic_ids,
            "selected_topic_labels": selected_topic_labels,
            "selected_topic_keywords": selected_topic_keywords,
        },
        "keyword_groups": {
            "competitors": sorted(set(clean_keyword(k) for k in competitor_keywords)),
            "competitor_topics": sorted(
                set(clean_keyword(k) for k in competitor_topic_keywords)
            ),
            "industry": sorted(set(clean_keyword(k) for k in industry_keywords)),
            "industry_topics": sorted(
                set(clean_keyword(k) for k in industry_topic_keywords)
            ),
            "signals": sorted(set(clean_keyword(k) for k in DEFAULT_SIGNAL_WORDS)),
        },
        "all_keywords": cleaned_all,
    }