import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.ai_client import suggest_competitors_with_ai
from app.auth import get_current_user
from app.database import get_db
from app.keyword_export import (
    get_inner_keywords,
    load_keyword_export,
    save_keyword_export,
)
from app.keyword_generator import generate_keywords
from app.models import MonitoringProfile, User
from app.schemas import (
    CompetitorSuggestionRequest,
    CompetitorSuggestionResponse,
    KeywordExportDocument,
    KeywordExportUpdate,
    MonitoringProfileCreate,
    MonitoringProfileResponse,
    MonitoringProfileUpdate,
)


router = APIRouter(prefix="/profiles", tags=["Monitoring Profiles"])


def get_owned_profile(
    profile_id: int,
    db: Session,
    current_user: User,
) -> MonitoringProfile:
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

    return profile


def profile_to_response(profile: MonitoringProfile) -> dict:
    stored = json.loads(profile.keywords_json)

    return {
        "id": profile.id,
        "profile_name": profile.profile_name,
        "phone_number": profile.phone_number,
        "company_name": profile.company_name,
        "industry": profile.industry,
        "product_description": profile.product_description,
        "competitors": json.loads(profile.competitors_json),
        "keywords": get_inner_keywords(stored),
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
    keywords_inner = generate_keywords(
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
        keywords_json="{}",
        user_id=current_user.id,
    )

    db.add(profile)
    db.flush()

    save_keyword_export(profile, current_user.id, keywords_inner)

    db.commit()
    db.refresh(profile)

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
    profile = get_owned_profile(profile_id, db, current_user)
    return profile_to_response(profile)


@router.put("/{profile_id}", response_model=MonitoringProfileResponse)
def update_profile(
    profile_id: int,
    profile_data: MonitoringProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_owned_profile(profile_id, db, current_user)

    profile.profile_name = profile_data.profile_name
    profile.phone_number = profile_data.phone_number
    profile.company_name = profile_data.company_name
    profile.industry = profile_data.industry
    profile.product_description = profile_data.product_description
    profile.competitors_json = json.dumps(profile_data.competitors)

    keywords_inner = generate_keywords(
        company_name=profile_data.company_name,
        industry=profile_data.industry,
        product_description=profile_data.product_description,
        competitors=profile_data.competitors,
    )
    save_keyword_export(profile, current_user.id, keywords_inner)

    db.commit()
    db.refresh(profile)

    return profile_to_response(profile)


@router.get("/{profile_id}/keywords", response_model=KeywordExportDocument)
def get_profile_keywords(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_owned_profile(profile_id, db, current_user)
    return load_keyword_export(profile, current_user.id)


@router.post(
    "/{profile_id}/keywords",
    response_model=KeywordExportDocument,
    status_code=status.HTTP_201_CREATED,
)
def create_profile_keywords(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create or regenerate the keyword export for this profile (one per profile)."""
    profile = get_owned_profile(profile_id, db, current_user)
    competitors = json.loads(profile.competitors_json)

    keywords_inner = generate_keywords(
        company_name=profile.company_name,
        industry=profile.industry,
        product_description=profile.product_description,
        competitors=competitors,
    )

    export = save_keyword_export(profile, current_user.id, keywords_inner)
    db.commit()
    db.refresh(profile)

    return export


@router.put("/{profile_id}/keywords", response_model=KeywordExportDocument)
def update_profile_keywords(
    profile_id: int,
    body: KeywordExportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Replace the inner keywords payload; metadata is refreshed from the profile."""
    profile = get_owned_profile(profile_id, db, current_user)

    export = save_keyword_export(profile, current_user.id, body.keywords)
    db.commit()
    db.refresh(profile)

    return export
