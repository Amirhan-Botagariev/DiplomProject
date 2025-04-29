from core.models.visualizations.query_cache import QueryCache
from core.models.db_helper import db_helper
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from datetime import datetime, timedelta, timezone
import hashlib
import json
import decimal


def safe_json(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")


class QueryCacheRepository:

    @staticmethod
    async def get_cache(query: str):
        async with db_helper.session_getter() as session:
            query_hash = hashlib.sha256(query.encode("utf-8")).hexdigest()
            result = await session.execute(
                select(QueryCache).where(
                    QueryCache.query_hash == query_hash,
                    QueryCache.expires_at > datetime.now(timezone.utc),
                )
            )
            cache_entry = result.scalars().first()
            if cache_entry:
                return json.loads(cache_entry.result_json)
            return None

    @staticmethod
    async def set_cache(query: str, result: list, ttl_minutes: int = 10):
        async with db_helper.session_getter() as session:
            query_hash = hashlib.sha256(query.encode("utf-8")).hexdigest()
            result_json = json.dumps([dict(row) for row in result], default=safe_json)
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes)

            stmt = insert(QueryCache).values(
                query_hash=query_hash,
                result_json=result_json,
                expires_at=expires_at
            ).on_conflict_do_update(
                index_elements=["query_hash"],
                set_={
                    "result_json": result_json,
                    "expires_at": expires_at
                }
            )

            await session.execute(stmt)
            await session.commit()
