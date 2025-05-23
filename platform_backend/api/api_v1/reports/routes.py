from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.models.db_helper import db_helper
from .factory import get_report

router = APIRouter()

async def get_session():
    async with db_helper.session_getter() as session:
        yield session

@router.get("/{report_type}/")
async def report_endpoint(report_type: str, session: AsyncSession = Depends(get_session)):
    try:
        report = get_report(report_type, session)
        stats = await report.get_stats()
        return report.serialize(stats)
    except ValueError:
        raise HTTPException(status_code=404, detail="Unknown report type")
