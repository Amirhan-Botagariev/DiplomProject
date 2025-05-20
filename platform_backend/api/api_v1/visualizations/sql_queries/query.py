from fastapi import APIRouter, HTTPException
from core.schemas.visualizations.query_schemas import ExecutePredefinedQueryRequest
from core.services.visualizations.query.query_service import QueryService

router = APIRouter()

@router.post("/execute_predefined")
async def execute_predefined_query(request: ExecutePredefinedQueryRequest):
    try:
        result, chart_type = await QueryService.execute_predefined(
            source_id=request.source_id,
            filters=request.filters
        )
        return {"data": result, "chart_type": chart_type}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))