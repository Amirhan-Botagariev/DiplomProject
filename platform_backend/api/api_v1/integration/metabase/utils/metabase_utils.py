from datetime import datetime, timedelta, UTC
from typing import Optional, Dict, Any, AsyncGenerator

import jwt
import requests

from core.config import settings
from core.models import db_helper


def generate_embed_url(
    resource_id: int,
    params: Optional[Dict] = None,
    expiry_minutes: int = settings.metabase.embed_expiry_minutes,
    resource_type: str = "dashboard",  # 'question' or 'dashboard'
) -> str:
    payload = {
        "resource": {resource_type: resource_id},
        "params": params or {},
        "exp": datetime.now(UTC) + timedelta(minutes=expiry_minutes),
        "permissions": {"read": True, "write": True},
    }

    token = jwt.encode(
        payload,
        settings.metabase.embedding_secret_key.get_secret_value(),
        algorithm="HS256",
    )

    return f"{settings.metabase.site_url}/embed/{resource_type}/{token}#bordered=true&titled=true"


def get_metabase_session():
    url = f"{settings.metabase.site_url}/api/session"
    response = requests.post(
        url,
        json={
            "username": settings.metabase.username,
            "password": settings.metabase.password,
        },
    )
    response.raise_for_status()
    return response.json()["id"]


def get_all_dashboards() -> list:
    session_token = get_metabase_session()
    headers = {"X-Metabase-Session": session_token}
    url = f"{settings.metabase.site_url}/api/dashboard"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data


async def get_async_session() -> AsyncGenerator[Any, Any]:
    async with db_helper.session_getter() as session:
        yield session
