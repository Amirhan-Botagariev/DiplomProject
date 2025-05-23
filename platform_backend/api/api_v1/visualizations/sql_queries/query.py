from fastapi import APIRouter, HTTPException
from core.schemas.visualizations.query_schemas import ExecutePredefinedQueryRequest
from core.services.visualizations.query.query_service import QueryService
from pydantic import BaseModel
from core.models.db_helper import db_helper
from sqlalchemy import text


class ExecuteSQLRequest(BaseModel):
    sql: str


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
    sql = request.sql.strip().lower()

    if not sql.startswith("select"):
        raise HTTPException(
            status_code=400, detail="Only SELECT statements are allowed."
        )

    try:
        async with db_helper.session_getter() as session:
            result = await session.execute(text(request.sql))
            rows = result.mappings().all()
            return {"data": rows}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
