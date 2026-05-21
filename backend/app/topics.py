TOPIC_OPTIONS = [
    {
        "id": "product_launch",
        "label": "Product Launch",
        "keywords": [
            "product launch",
            "new product",
            "launched",
            "introduces",
            "unveils",
        ],
    },
    {
        "id": "feature_release",
        "label": "Feature Release",
        "keywords": [
            "new feature",
            "feature release",
            "platform update",
            "software update",
            "release notes",
        ],
    },
    {
        "id": "pricing_change",
        "label": "Pricing Change",
        "keywords": [
            "pricing",
            "price change",
            "subscription price",
            "new pricing",
            "plan update",
        ],
    },
    {
        "id": "partnership",
        "label": "Partnership",
        "keywords": [
            "partnership",
            "partners with",
            "strategic partnership",
            "collaboration",
            "alliance",
        ],
    },
    {
        "id": "funding",
        "label": "Funding",
        "keywords": [
            "funding",
            "raises",
            "investment",
            "series a",
            "series b",
            "venture capital",
        ],
    },
    {
        "id": "acquisition",
        "label": "Acquisition",
        "keywords": [
            "acquisition",
            "acquires",
            "merger",
            "M&A",
            "bought",
        ],
    },
    {
        "id": "market_expansion",
        "label": "Market Expansion",
        "keywords": [
            "expansion",
            "expands into",
            "new market",
            "international expansion",
            "launches in",
        ],
    },
    {
        "id": "ai_innovation",
        "label": "AI Innovation",
        "keywords": [
            "AI",
            "artificial intelligence",
            "machine learning",
            "automation",
            "generative AI",
        ],
    },
    {
        "id": "regulation",
        "label": "Regulation",
        "keywords": [
            "regulation",
            "compliance",
            "regulatory approval",
            "new rules",
            "legal requirement",
        ],
    },
    {
        "id": "executive_change",
        "label": "Executive Change",
        "keywords": [
            "CEO",
            "CFO",
            "CTO",
            "appoints",
            "steps down",
            "leadership change",
        ],
    },
]


def get_topic_by_id(topic_id: str) -> dict | None:
    for topic in TOPIC_OPTIONS:
        if topic["id"] == topic_id:
            return topic
    return None


def validate_topic_ids(topic_ids: list[str]) -> list[str]:
    valid_ids = {topic["id"] for topic in TOPIC_OPTIONS}
    invalid_ids = [topic_id for topic_id in topic_ids if topic_id not in valid_ids]

    return invalid_ids


def get_keywords_for_topic_ids(topic_ids: list[str]) -> list[str]:
    keywords = []

    for topic_id in topic_ids:
        topic = get_topic_by_id(topic_id)

        if topic:
            keywords.extend(topic["keywords"])

    return sorted(set(keyword.strip() for keyword in keywords if keyword.strip()))


def get_topic_labels_for_ids(topic_ids: list[str]) -> list[str]:
    labels = []

    for topic_id in topic_ids:
        topic = get_topic_by_id(topic_id)

        if topic:
            labels.append(topic["label"])

    return labels