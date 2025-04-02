from fastapi import APIRouter

from core.schemas.user import UserCreate, UserRead
from libraries.fastapi_users.dependencies.authentication import authentication_backend

# 👉 Кастомные роутеры
from libraries.fastapi_users.routers.auth import get_auth_router
from libraries.fastapi_users.routers.fastapi_users_routers import fastapi_users
from libraries.fastapi_users.routers.register import get_register_router

router = APIRouter()

# /login и /logout
router.include_router(
    get_auth_router(
        backend=authentication_backend,
        get_user_manager=fastapi_users.get_user_manager,
        authenticator=fastapi_users.authenticator,
        requires_verification=True,
    )
)

# /register
router.include_router(
    get_register_router(
        get_user_manager=fastapi_users.get_user_manager,
        user_schema=UserRead,
        user_create_schema=UserCreate,
    )
)
