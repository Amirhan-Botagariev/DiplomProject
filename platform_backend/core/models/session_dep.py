from core.models.db_helper import db_helper
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with db_helper.session_getter() as session:
        yield session
