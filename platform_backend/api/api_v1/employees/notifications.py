from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.models.db_helper import db_helper
from core.models.session_dep import get_session
from .service import EmployeeService
from .schemas import EmployeeListResponse

router = APIRouter()

@router.get("/attrition_risk", summary="Get employees by attrition risk", response_model=EmployeeListResponse)
async def get_attrition_risk(
    skip: int = 0,
    session: AsyncSession = Depends(get_session),
):
    """
    Возвращает список неуволенных сотрудников с уровнем риска увольнения (отсортировано по убыванию риска).
    """
    service = EmployeeService(session)
    filters = {"attrition": False}
    employees_response = await service.get_employees(filters, skip, None, sort_by="risk", sort_order="desc")
    return employees_response