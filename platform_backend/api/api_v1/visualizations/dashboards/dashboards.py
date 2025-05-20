from typing import List

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from core.models.db_helper import db_helper
from core.models.visualizations.dashboard_configurations import (
    DashboardConfiguration as DBDashboardConfig,
)
from core.schemas.visualizations.dashboard_configurations import (
    DashboardConfigurationBase as SchemaDashboardConfig,
)

router = APIRouter()


@router.get(
    "/",
    response_model=List[SchemaDashboardConfig],
    summary="Получить все конфигурации дэшбордов",
    description="Возвращает список всех записей из таблицы dashboard_configurations",
)
async def read_dashboard_configurations():
    """
    Возвращает все записи из dashboard_configurations
    """
    async with db_helper.session_getter() as db:
        result = await db.execute(select(DBDashboardConfig))
        configs = result.scalars().all()
        if not configs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Конфигурации дэшбордов не найдены",
            )
        return configs
