from typing import AsyncGenerator
from core.models import User
from core.models.db_helper import db_helper
from libraries.fastapi_users.authentication.user_manager import UserManager

async def get_user_manager() -> AsyncGenerator[UserManager, None]:
    async with db_helper.session_getter() as session:
        yield UserManager(User.get_db(session))