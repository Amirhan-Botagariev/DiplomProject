from core.models.visualizations.predefined_source import PredefinedSource
from core.models.db_helper import db_helper
from sqlalchemy import select

class PredefinedSourceRepository:
    @staticmethod
    async def get_by_id(source_id: int):
        async with db_helper.session_getter() as session:
            result = await session.get(PredefinedSource, source_id)
            return result

    @staticmethod
    async def get_all():
        async with db_helper.session_getter() as session:
            result = await session.execute(select(PredefinedSource))
            return result.scalars().all()