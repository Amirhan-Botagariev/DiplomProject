# app/routes/metabase.py
from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from core.models.metabase.dashboards import Dashboard
from core.schemas.metabase.dashboard import Dashboard as DashboardPydantic
from .utils.metabase_crud import get_all_dashboards as get_all_dashboards_from_db
from .utils.metabase_utils import (
    generate_embed_url,
    get_all_dashboards,
    get_async_session,
)

router = APIRouter()


@router.post("/load-dashboards")
async def load_dashboards():
    dashboards = get_all_dashboards()

    if dashboards is None:
        raise HTTPException(
            status_code=500, detail="Не удалось получить дашборды из Metabase"
        )

    async with db_helper.session_getter() as session:
        for d in dashboards:
            dashboard = Dashboard(
                dashboard_id=d["id"],
                dashboard_name=d["name"],
                dashboard_url=f"/metabase/dashboard/{d['id']}",
                creator_id=d.get("creator", {}).get("id"),
                creator_name=d.get("creator", {}).get("common_name", "Неизвестно"),
                created_at=(
                    datetime.fromisoformat(
                        d.get("created_at").replace("Z", "+00:00")
                    ).replace(tzinfo=None)
                    if d.get("created_at")
                    else None
                ),
                updated_at=(
                    datetime.fromisoformat(
                        d.get("updated_at").replace("Z", "+00:00")
                    ).replace(tzinfo=None)
                    if d.get("updated_at")
                    else None
                ),
                # access_user_ids=None,
                # access_groups=None, #TODO: Доделать дэшборды с правами доступа
                category=None,  # TODO: Подумать над реализацией category
                tags=None,  # TODO: Подумать над реализацией tags
            )
            await session.merge(dashboard)

        await session.commit()

    return {"imported_dashboards": len(dashboards)}


@router.get(
    "/dashboards",
    response_model=List[DashboardPydantic],
)
async def get_dashboards(
    session: AsyncSession = Depends(get_async_session),
):
    dashboards = await get_all_dashboards_from_db(session)
    return dashboards


@router.get("/dashboards/{id}")
async def get_dashboard_embed_url(id: int):
    url = generate_embed_url(id)
    return {"embed_url": url}
