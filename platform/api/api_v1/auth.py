from fastapi import APIRouter

from api.api_v1.fastapi_users_routers import fastapi_users
from api.dependencies.authentication.backend import authentication_backend

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(authentication_backend),
)
