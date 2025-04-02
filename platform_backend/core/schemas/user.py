from libraries.fastapi_users.schemas import base_user
from core.types.user_id import UserIdType


class UserRead(base_user.BaseUser[UserIdType]):
    pass


class UserCreate(base_user.BaseUserCreate):
    pass


class UserUpdate(base_user.BaseUserUpdate):
    pass
