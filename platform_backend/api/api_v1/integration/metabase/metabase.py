# app/routes/metabase.py
from fastapi import APIRouter, Query
from .utils.metabase_utils import generate_embed_url

router = APIRouter()


@router.get("/dashboard-url")
def get_dashboard_url(dashboard_id: int = Query(...), user_id: int = Query(None)):
    # Можно передавать фильтры, если они есть в дашборде
    filters = {"user_id": user_id} if user_id else {}
    url = generate_embed_url(dashboard_id, filters)
    return {"url": url}
