from fastapi import APIRouter
from app.topics import TOPIC_OPTIONS


router = APIRouter(prefix="/topics", tags=["Topics"])


@router.get("/")
def get_topic_options():
    return [
        {
            "id": topic["id"],
            "label": topic["label"],
        }
        for topic in TOPIC_OPTIONS
    ]