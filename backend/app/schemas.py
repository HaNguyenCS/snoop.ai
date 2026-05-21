# app/schemas.py

from typing import List

from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CurrentUserResponse(BaseModel):
    id: int
    email: EmailStr


class TopicOptionResponse(BaseModel):
    id: str
    label: str


class CompanyProfileCreate(BaseModel):
    company_name: str
    industry: str
    product_description: str
    competitors: List[str]
    topic_ids: List[str]


class CompanyProfileResponse(BaseModel):
    id: int
    company_name: str
    industry: str
    product_description: str
    competitors: List[str]
    topic_ids: List[str]
    topics_to_monitor: List[str]
    keywords: dict