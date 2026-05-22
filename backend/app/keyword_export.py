import json
from datetime import datetime, timezone
from typing import Any, Dict

from app.models import MonitoringProfile


def is_export_document(data: Dict[str, Any]) -> bool:
    return (
        isinstance(data, dict)
        and "keywords" in data
        and isinstance(data["keywords"], dict)
        and "exported_at" in data
        and "profile_id" in data
        and "user_id" in data
    )


def get_inner_keywords(stored: Dict[str, Any]) -> Dict[str, Any]:
    if is_export_document(stored):
        return stored["keywords"]
    return stored


def build_keyword_export(
    profile: MonitoringProfile,
    user_id: int,
    keywords_inner: Dict[str, Any],
) -> Dict[str, Any]:
    return {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "profile_id": profile.id,
        "profile_name": profile.profile_name,
        "phone_number": profile.phone_number,
        "keywords": keywords_inner,
    }


def load_keyword_export(profile: MonitoringProfile, user_id: int) -> Dict[str, Any]:
    stored = json.loads(profile.keywords_json)

    if is_export_document(stored):
        export = dict(stored)
    else:
        export = build_keyword_export(profile, user_id, stored)

    export["user_id"] = user_id
    export["profile_id"] = profile.id
    export["profile_name"] = profile.profile_name
    export["phone_number"] = profile.phone_number
    return export


def save_keyword_export(
    profile: MonitoringProfile,
    user_id: int,
    keywords_inner: Dict[str, Any],
) -> Dict[str, Any]:
    export = build_keyword_export(profile, user_id, keywords_inner)
    profile.keywords_json = json.dumps(export)
    return export
