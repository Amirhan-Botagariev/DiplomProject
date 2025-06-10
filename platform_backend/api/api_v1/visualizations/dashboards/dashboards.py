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
from services.kafka.kafka_service import send_kafka_event

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

            dashboard.graphs = (dashboard.graphs or []) + [new_graph]
            await db.commit()
            await db.refresh(dashboard)

            await send_kafka_event(
                "graph_added",
                {
                    "route_id": dashboard.route_id,
                    "graph_name": new_graph.get("name"),
                },
            )

            return {"message": f"График добавлен в {dashboard.name}", "status": 1}

        except Exception as e:
            await db.rollback()
            return {"message": f"Ошибка: {str(e)}", "status": 0}


@router.put("/{dashboard_id}")
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

            await send_kafka_event(
                "dashboard_updated",
                {
                    "route_id": dashboard.route_id,
                    "name": dashboard.name,
                    "graph_count": len(dashboard.graphs or []),
                },
            )

            return {"message": "Конфигурация дэшборда обновлена", "status": 1}
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка обновления: {str(e)}")


@router.delete("/{dashboard_id}")
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

        await send_kafka_event(
            "dashboard_deleted",
            {"route_id": dashboard.route_id, "name": dashboard.name},
        )

        return {"message": "Дэшборд удалён", "status": 1}
