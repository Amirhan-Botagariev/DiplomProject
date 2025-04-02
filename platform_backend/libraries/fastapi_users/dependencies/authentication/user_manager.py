from fastapi import Depends

from libraries.fastapi_users.authentication.user_manager import UserManager
from .users import get_users_db


async def get_user_manager(user_db=Depends(get_users_db)) -> UserManager:
    return UserManager(user_db)
