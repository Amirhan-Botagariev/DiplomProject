from fastapi import APIRouter

from core.config import settings
from .users import router as users_router
from .auth import router as auth_router
from .messages import router as messages_router

router = APIRouter(
    prefix=settings.api.v1.prefix,
)
router.include_router(
    users_router,
    prefix=settings.api.v1.users,
    tags=["Users"],
)

router.include_router(
    auth_router,
    prefix=settings.api.v1.auth,
    tags=["Auth"],
)

router.include_router(
    messages_router,
    prefix=settings.api.v1.messages,
    tags=["Messages"],
)
