from fastapi import APIRouter, HTTPException
from core.schemas.visualizations.query_schemas import ExecutePredefinedQueryRequest
from core.services.visualizations.query.query_service import QueryService
from pydantic import BaseModel
from core.models.db_helper import db_helper
from sqlalchemy import text
from services.redis.redis_cache import redis_client
import hashlib
import json
import decimal


class ExecuteSQLRequest(BaseModel):
    sql: str


def serialize(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")


router = APIRouter()


@router.post("/execute_predefined")
async def execute_predefined_query(request: ExecutePredefinedQueryRequest):
    try:
        result, chart_type = await QueryService.execute_predefined(
            source_id=request.source_id, filters=request.filters
        )
        return {"data": result, "chart_type": chart_type}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/execute_sql")
async def execute_sql_query(request: ExecuteSQLRequest):
    sql = request.sql.strip()

    if not sql.lower().startswith("select"):
        raise HTTPException(
            status_code=400, detail="Only SELECT statements are allowed."
        )

    key = f"sql_cache:{hashlib.md5(sql.encode()).hexdigest()}"

    cached = await redis_client.get(key)
    if cached:
        try:
            return {"data": json.loads(cached)}
        except json.JSONDecodeError:
            pass

    try:
        async with db_helper.session_getter() as session:
            result = await session.execute(text(sql))
            rows = result.mappings().all()
            data = [dict(row) for row in rows]

            await redis_client.set(key, json.dumps(data, default=serialize), ex=600)

            return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
