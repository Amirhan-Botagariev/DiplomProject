from typing import List

from fastapi import APIRouter, HTTPException, status, Query, Body, Path
from sqlalchemy import select

from core.models.db_helper import db_helper
from core.models.visualizations.dashboard_configurations import (
    DashboardConfiguration as DBDashboardConfig,
)
from core.schemas.visualizations.dashboard_configurations import (
    DashboardConfigurationBase as SchemaDashboardConfig,
    DashboardConfigurationUpdate as SchemaDashboardConfigUpdate,
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


@router.put(
    "/{dashboard_id}",
    summary="Обновить конфигурацию дэшборда",
    description="Обновляет поля дэшборда по его ID, включая список графиков.",
)
async def update_dashboard_configuration(
    dashboard_id: str = Path(..., description="route_id дэшборда"),
    updated_dashboard: SchemaDashboardConfigUpdate = Body(...),
):
    async with db_helper.session_getter() as db:
        try:
            result = await db.execute(
                select(DBDashboardConfig).where(
                    DBDashboardConfig.route_id == dashboard_id
                )
            )
            dashboard = result.scalar_one_or_none()

            if not dashboard:
                raise HTTPException(status_code=404, detail="Дэшборд не найден")

            dashboard.name = updated_dashboard.name
            dashboard.description = updated_dashboard.description
            dashboard.route_id = updated_dashboard.route_id
            dashboard.graphs = [
                graph.model_dump() for graph in updated_dashboard.graphs
            ]

            await db.commit()
            await db.refresh(dashboard)

            return {"message": "Конфигурация дэшборда обновлена", "status": 1}
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка обновления: {str(e)}")

@router.delete(
    "/{dashboard_id}",
    summary="Удалить конфигурацию дэшборда",
    description="Удаляет дэшборд по route_id.",
)
async def delete_dashboard(
    dashboard_id: str = Path(..., description="route_id дэшборда"),
):
    async with db_helper.session_getter() as db:
        result = await db.execute(
            select(DBDashboardConfig).where(DBDashboardConfig.route_id == dashboard_id)
        )
        dashboard = result.scalar_one_or_none()

        if not dashboard:
            raise HTTPException(status_code=404, detail="Дэшборд не найден")

        await db.delete(dashboard)
        await db.commit()

        return {"message": "Дэшборд удалён", "status": 1}