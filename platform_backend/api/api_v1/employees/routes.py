from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from core.models.db_helper import db_helper
from core.models.session_dep import get_session
from .service import EmployeeService
from .schemas import EmployeeFilterParams, EmployeeListResponse

router = APIRouter()

@router.get("/", summary="Get employees with filters", response_model=EmployeeListResponse)
async def get_employees(
    filters: EmployeeFilterParams = Depends(),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    sort_by: Optional[str] = Query(None, description="Field to sort by"),
    sort_order: Optional[str] = Query("asc", pattern="^(asc|desc)$", description="Sort order: asc or desc"),
    session: AsyncSession = Depends(get_session),
):
    """
    Получить список сотрудников с фильтрацией, пагинацией и сортировкой.
    """
    service = EmployeeService(session)
    # filters.dict(exclude_unset=True) — только переданные значения
    return await service.get_employees(filters.dict(exclude_unset=True), skip, limit, sort_by, sort_order)

# Удалены справочные endpoints — теперь они централизованы в reference.py
