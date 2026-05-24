import json
import subprocess
import asyncio
import re
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from groq import Groq

from app.database import get_db
from app.models import MonitoringProfile, ScraperEvent
from app.ai_client import analyze_post

router = APIRouter(prefix="/scraper", tags=["Scraper"])


@router.get("/config")
def get_scraper_config(db: Session = Depends(get_db)):
    profiles = db.query(MonitoringProfile).all()
    result = []
    for p in profiles:
        result.append(
            {
                "profileId": p.id,
                "companyName": p.company_name,
                "industry": p.industry,
                "competitors": json.loads(p.competitors_json),
            }
        )
    return {"profiles": result}


async def handle_match(line: str, db: Session):
    try:
        match = json.loads(line.strip())
    except json.JSONDecodeError:
        return

    text = match.get("text", "")
    url = match.get("url", "")
    profiles = match.get("profiles", [])

    if not text or not profiles:
        return

    first_keyword = profiles[0]["keyword"]
    verdict = analyze_post(text, first_keyword)

    if not verdict or not verdict.get("is_relevant"):
        return

    for entry in profiles:
        profile_id = entry["profile_id"]
        keyword = entry["keyword"]

        event = ScraperEvent(
            profile_id=profile_id,
            source="bluesky",
            matched_keyword=keyword,
            text=text,
            url=url,
            verdict=verdict["verdict"],
            category=verdict.get("category"),
            summary=verdict.get("summary"),
            action_item=verdict.get("action_item"),
            detected_at=datetime.now(timezone.utc),
        )
        db.add(event)

    db.commit()
    print(
        f"[pipeline] Stored verdict={verdict['verdict']} for {len(profiles)} profile(s)"
    )


async def run_cpp_engine(db: Session):
    process = subprocess.Popen(
        ["../scraper/build/scraper"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
    )
    print("[cpp] Engine started")
    loop = asyncio.get_event_loop()
    while True:
        line = await loop.run_in_executor(None, process.stdout.readline)
        if not line:
            print("[cpp] Engine died, restarting in 5s")
            await asyncio.sleep(5)
            asyncio.create_task(run_cpp_engine(db))
            return
        asyncio.create_task(handle_match(line, db))
