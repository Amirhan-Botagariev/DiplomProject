# app/routes/metabase.py
from fastapi import APIRouter, Query
from .utils.metabase_utils import generate_embed_url

router = APIRouter()


@router.get("/dashboard-url")
def get_question_embed_url(question_id: int) -> dict:
    url = generate_embed_url(question_id=question_id)
    return {"embed_url": url}
