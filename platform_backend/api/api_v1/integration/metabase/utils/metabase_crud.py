from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.models.metabase.dashboards import Dashboard

async def get_all_dashboards(session: AsyncSession):
    """Получить все дэшборды."""
    result = await session.execute(select(Dashboard))
    return result.scalars().all()

async def get_dashboard_by_id(session: AsyncSession, dashboard_id: int):
    """Получить дэшборд по ID."""
    result = await session.execute(select(Dashboard).where(Dashboard.dashboard_id == dashboard_id))
    return result.scalar_one_or_none()

async def create_dashboard(session: AsyncSession, dashboard_data: Dashboard):
    """Создать новый дэшборд."""
    session.add(dashboard_data)
    await session.commit()
    await session.refresh(dashboard_data)
    return dashboard_data

async def update_dashboard(session: AsyncSession, dashboard_id: int, updated_fields: dict):
    """Обновить существующий дэшборд."""
    dashboard = await get_dashboard_by_id(session, dashboard_id)
    if dashboard:
        for key, value in updated_fields.items():
            setattr(dashboard, key, value)
        await session.commit()
        await session.refresh(dashboard)
    return dashboard

async def delete_dashboard(session: AsyncSession, dashboard_id: int):
    """Удалить дэшборд по ID."""
    dashboard = await get_dashboard_by_id(session, dashboard_id)
    if dashboard:
        await session.delete(dashboard)
        await session.commit()
    return dashboard
