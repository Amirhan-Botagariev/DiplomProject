from fastapi import APIRouter

from api.api_v1.fastapi_users_routers import fastapi_users
from api.dependencies.authentication.backend import authentication_backend
from core.schemas.user import UserCreate, UserRead

router = APIRouter()

# /login
# /logout
router.include_router(
    fastapi_users.get_auth_router(authentication_backend),
)

# register
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

# /request-verify-token
# /verify

router.include_router(
    fastapi_users.get_verify_router(UserRead),
)

# /reset-password
# /forgot-password
router.include_router(
    fastapi_users.get_reset_password_router(),
)
