from typing import List

from fastapi import APIRouter, HTTPException, status, Query, Body
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


@router.post("/")
async def add_graph_to_dashboard(
    route_id: str = Query(...),
    new_graph: dict = Body(...),
):
    async with db_helper.session_getter() as db:
        try:
            result = await db.execute(
                select(DBDashboardConfig).where(DBDashboardConfig.route_id == route_id)
            )
            dashboard = result.scalar_one_or_none()

            if not dashboard:
                return {
                    "message": f"Дэшборд с route_id '{route_id}' не найден",
                    "status": 0,
                }

            print("📍 Было графиков:", len(dashboard.graphs or []))
            # заменяем новым списком, чтобы SQLAlchemy отследил изменение
            dashboard.graphs = (dashboard.graphs or []) + [new_graph]

            await db.commit()
            await db.refresh(dashboard)
            print("✅ Новый график добавлен. Всего графиков:", len(dashboard.graphs))

            return {"message": f"График добавлен в {dashboard.name}", "status": 1}

        except Exception as e:
            await db.rollback()
            print("❌ Ошибка:", str(e))
            return {"message": f"Ошибка: {str(e)}", "status": 0}
