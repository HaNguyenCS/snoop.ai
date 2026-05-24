from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    profiles = relationship(
        "MonitoringProfile",
        back_populates="owner",
        cascade="all, delete-orphan",
    )


class MonitoringProfile(Base):
    __tablename__ = "monitoring_profiles"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    product_description = Column(Text, nullable=False)
    competitors_json = Column(Text, nullable=False)
    keywords_json = Column(Text, nullable=False)
    profile_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="profiles")
    events = relationship("ScraperEvent", back_populates="profile")


class ScraperEvent(Base):
    __tablename__ = "scraper_events"

    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey("monitoring_profiles.id"))
    source = Column(String, default="bluesky")
    matched_keyword = Column(String)
    text = Column(String)
    url = Column(String)
    verdict = Column(String)  # High / Medium / Low / None
    category = Column(String)
    summary = Column(String)
    action_item = Column(String)
    detected_at = Column(DateTime)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    profile = relationship("MonitoringProfile", back_populates="events")
