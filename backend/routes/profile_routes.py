import json
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.keyword_generator import generate_keywords
from app.models import CompanyProfile, User
from app.schemas import CompanyProfileCreate, CompanyProfileResponse
from app.topics import (
    get_keywords_for_topic_ids,
    get_topic_labels_for_ids,
    validate_topic_ids,
)


router = APIRouter(prefix="/profiles", tags=["Company Profiles"])

EXPORT_DIR = "data/keyword_exports"


def save_keyword_export(
    user_id: int,
    profile_id: int,
    keywords: dict,
) -> str:
    os.makedirs(EXPORT_DIR, exist_ok=True)

    path = f"{EXPORT_DIR}/user_{user_id}_profile_{profile_id}_keywords.json"

    export_data = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "profile_id": profile_id,
        "keywords": keywords,
    }

    with open(path, "w", encoding="utf-8") as file:
        json.dump(export_data, file, indent=2)

    return path


def profile_to_response(profile: CompanyProfile) -> dict:
    topic_ids = json.loads(profile.topic_ids_json)

    return {
        "id": profile.id,
        "company_name": profile.company_name,
        "industry": profile.industry,
        "product_description": profile.product_description,
        "competitors": json.loads(profile.competitors_json),
        "topic_ids": topic_ids,
        "topics_to_monitor": get_topic_labels_for_ids(topic_ids),
        "keywords": json.loads(profile.keywords_json),
    }


@router.post("/", response_model=CompanyProfileResponse)
def create_profile(
    profile_data: CompanyProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invalid_topic_ids = validate_topic_ids(profile_data.topic_ids)

    if invalid_topic_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Invalid topic_ids selected",
                "invalid_topic_ids": invalid_topic_ids,
            },
        )

    selected_topic_labels = get_topic_labels_for_ids(profile_data.topic_ids)
    selected_topic_keywords = get_keywords_for_topic_ids(profile_data.topic_ids)

    keywords = generate_keywords(
        company_name=profile_data.company_name,
        industry=profile_data.industry,
        product_description=profile_data.product_description,
        competitors=profile_data.competitors,
        selected_topic_ids=profile_data.topic_ids,
        selected_topic_labels=selected_topic_labels,
        selected_topic_keywords=selected_topic_keywords,
    )

    profile = CompanyProfile(
        company_name=profile_data.company_name,
        industry=profile_data.industry,
        product_description=profile_data.product_description,
        competitors_json=json.dumps(profile_data.competitors),
        topic_ids_json=json.dumps(profile_data.topic_ids),
        keywords_json=json.dumps(keywords),
        user_id=current_user.id,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    save_keyword_export(
        user_id=current_user.id,
        profile_id=profile.id,
        keywords=keywords,
    )

    return profile_to_response(profile)
# example response:
# {
#   "id": 1,
#   "company_name": "Shopify",
#   "industry": "E-commerce software",
#   "product_description": "Platform that helps merchants create online stores.",
#   "competitors": ["Wix", "BigCommerce"],
#   "topic_ids": ["product_launch", "pricing_change"],
#   "topics_to_monitor": ["Product Launch", "Pricing Change"],
#   "keywords": {
#     "all_keywords": [
#       "wix product launch",
#       "wix pricing",
#       "bigcommerce product launch",
#       "bigcommerce pricing"
#     ]
#   }
# }

@router.get("/", response_model=list[CompanyProfileResponse])
def get_my_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profiles = (
        db.query(CompanyProfile)
        .filter(CompanyProfile.user_id == current_user.id)
        .all()
    )

    return [profile_to_response(profile) for profile in profiles]


@router.get("/{profile_id}", response_model=CompanyProfileResponse)
def get_one_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(CompanyProfile)
        .filter(
            CompanyProfile.id == profile_id,
            CompanyProfile.user_id == current_user.id,
        )
        .first()
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return profile_to_response(profile)


@router.get("/{profile_id}/keywords")
def get_profile_keywords(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(CompanyProfile)
        .filter(
            CompanyProfile.id == profile_id,
            CompanyProfile.user_id == current_user.id,
        )
        .first()
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return json.loads(profile.keywords_json)