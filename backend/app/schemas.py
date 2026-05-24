from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CurrentUserResponse(BaseModel):
    id: int
    email: EmailStr


class CompetitorSuggestionRequest(BaseModel):
    company_name: str
    industry: str
    product_description: str


class CompetitorSuggestionResponse(BaseModel):
    suggested_competitors: List[str]


class MonitoringProfileCreate(BaseModel):
    profile_name: str
    phone_number: str
    company_name: str
    industry: str
    product_description: str
    competitors: List[str]


class MonitoringProfileResponse(BaseModel):
    id: int
    profile_name: str
    phone_number: str
    company_name: str
    industry: str
    product_description: str
    competitors: List[str]
    keywords: dict


class ScraperEventResponse(BaseModel):
    id: int
    profile_id: int
    source: str
    matched_keyword: Optional[str] = None
    text: Optional[str] = None
    url: Optional[str] = None
    verdict: Optional[str] = None
    category: Optional[str] = None
    summary: Optional[str] = None
    action_item: Optional[str] = None
    detected_at: Optional[datetime] = None
    created_at: Optional[datetime] = None