from typing import List

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
    company_name: str
    industry: str
    product_description: str
    competitors: List[str]


class MonitoringProfileResponse(BaseModel):
    id: int
    company_name: str
    industry: str
    product_description: str
    competitors: List[str]
    keywords: dict