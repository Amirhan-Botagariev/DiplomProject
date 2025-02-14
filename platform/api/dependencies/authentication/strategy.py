import uuid
from typing import TYPE_CHECKING, Annotated

from fastapi import Depends
from fastapi_users.authentication.strategy.db import DatabaseStrategy

from .access_tokens import get_access_tokens_db
from core.config import settings

if TYPE_CHECKING:
    from fastapi_users.authentication.strategy.db import AccessTokenDatabase
    from core.models import AccessToken


def get_database_strategy(
    access_tokens_dbs: Annotated[
        AccessTokenDatabase["AccessToken"],
        Depends(get_access_tokens_db),
    ],
) -> DatabaseStrategy:
    return DatabaseStrategy(
        database=access_tokens_dbs,
        lifetime_seconds=settings.access_token.lifetime_seconds,
    )
