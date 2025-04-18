from datetime import datetime, timedelta, UTC
from typing import Optional, Dict

import jwt

from core.config import settings


def generate_embed_url(dashboard_id: int, params: Optional[Dict] = None) -> str:
    payload = {
        "resource": {"dashboard": dashboard_id},
        "params": params or {},
        "exp": datetime.now(UTC)
        + timedelta(minutes=settings.metabase.embed_expiry_minutes),
    }

    token = jwt.encode(
        payload,
        settings.metabase.embedding_secret_key.get_secret_value(),
        algorithm="HS256",
    )

    iframe_url = f"{settings.metabase.site_url}/embed/dashboard/{token}#bordered=true&titled=true"
    return iframe_url
