from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.api_v1.predict.utils.predict_model import predict_attrition_probabilities
from core.models.db_helper import db_helper

router = APIRouter()


@router.post("/attrition")
async def predict_attrition(session: AsyncSession = Depends(db_helper.session_getter)):
    updated_count = await predict_attrition_probabilities(session)
    return {"status": "ok", "updated": updated_count}
