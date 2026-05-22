import json
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.ai_client import suggest_competitors_with_ai
from app.auth import get_current_user
from app.database import get_db
from app.keyword_generator import generate_keywords
from app.models import MonitoringProfile, User
from app.schemas import (
    CompetitorSuggestionRequest,
    CompetitorSuggestionResponse,
    MonitoringProfileCreate,
    MonitoringProfileResponse,
)


router = APIRouter(prefix="/profiles", tags=["Monitoring Profiles"])

EXPORT_DIR = "data/keyword_exports"


def save_keyword_export(
    user_id: int,
    profile_id: int,
    profile_name: str,
    phone_number: str,
    keywords: dict,
) -> str:
    os.makedirs(EXPORT_DIR, exist_ok=True)

    path = f"{EXPORT_DIR}/user_{user_id}_profile_{profile_id}_keywords.json"

    export_data = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "profile_id": profile_id,
        "profile_name": profile_name,
        "phone_number": phone_number,
        "keywords": keywords,
    }

    with open(path, "w", encoding="utf-8") as file:
        json.dump(export_data, file, indent=2)

    return path


def profile_to_response(profile: MonitoringProfile) -> dict:
    return {
        "id": profile.id,
        "profile_name": profile.profile_name,
        "phone_number": profile.phone_number,
        "company_name": profile.company_name,
        "industry": profile.industry,
        "product_description": profile.product_description,
        "competitors": json.loads(profile.competitors_json),
        "keywords": json.loads(profile.keywords_json),
    }


@router.post("/suggest-competitors", response_model=CompetitorSuggestionResponse)
def suggest_competitors(
    request_data: CompetitorSuggestionRequest,
    current_user: User = Depends(get_current_user),
):
    suggested_competitors = suggest_competitors_with_ai(
        company_name=request_data.company_name,
        industry=request_data.industry,
        product_description=request_data.product_description,
    )

    return {
        "suggested_competitors": suggested_competitors,
    }


@router.post("/", response_model=MonitoringProfileResponse)
def create_profile(
    profile_data: MonitoringProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    keywords = generate_keywords(
        company_name=profile_data.company_name,
        industry=profile_data.industry,
        product_description=profile_data.product_description,
        competitors=profile_data.competitors,
    )

    profile = MonitoringProfile(
        profile_name=profile_data.profile_name,
        phone_number=profile_data.phone_number,
        company_name=profile_data.company_name,
        industry=profile_data.industry,
        product_description=profile_data.product_description,
        competitors_json=json.dumps(profile_data.competitors),
        keywords_json=json.dumps(keywords),
        user_id=current_user.id,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    save_keyword_export(
        user_id=current_user.id,
        profile_id=profile.id,
        profile_name=profile.profile_name,
        phone_number=profile.phone_number,
        keywords=keywords,
    )

    return profile_to_response(profile)


@router.get("/", response_model=list[MonitoringProfileResponse])
def get_my_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profiles = (
        db.query(MonitoringProfile)
        .filter(MonitoringProfile.user_id == current_user.id)
        .all()
    )

    return [profile_to_response(profile) for profile in profiles]


@router.get("/{profile_id}", response_model=MonitoringProfileResponse)
def get_one_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(MonitoringProfile)
        .filter(
            MonitoringProfile.id == profile_id,
            MonitoringProfile.user_id == current_user.id,
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
        db.query(MonitoringProfile)
        .filter(
            MonitoringProfile.id == profile_id,
            MonitoringProfile.user_id == current_user.id,
        )
        .first()
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return json.loads(profile.keywords_json)