from fastapi import APIRouter

from libraries.fastapi_users.routers.fastapi_users_routers import fastapi_users
from core.config import settings
from core.schemas.user import UserRead, UserUpdate

router = APIRouter(
    prefix=settings.api.v1.users,
)

# /me
# /{id}
router.include_router(
    router=fastapi_users.get_users_router(
        UserRead,
        UserUpdate,
    ),
)
