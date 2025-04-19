from datetime import datetime, timedelta, UTC
from typing import Optional, Dict

import jwt

from core.config import settings


def generate_embed_url(
    question_id: int,
    params: Optional[Dict] = None,
    expiry_minutes: int = settings.metabase.embed_expiry_minutes,
) -> str:
    payload = {
        "resource": {"question": question_id},
        "params": params or {},
        "exp": datetime.now(UTC) + timedelta(minutes=expiry_minutes),
    }

    token = jwt.encode(
        payload,
        settings.metabase.embedding_secret_key.get_secret_value(),
        algorithm="HS256",
    )

    return f"{settings.metabase.site_url}/embed/question/{token}#bordered=true&titled=true"
