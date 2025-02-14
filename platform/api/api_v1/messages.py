from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Depends

from api.api_v1.fastapi_users_routers import (
    current_active_user,
    current_active_superuser,
)
from core.models import User
from core.schemas.user import UserRead

router = APIRouter()


@router.get("")
def get_user_messages(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
):
    return {
        "messages": ["m1", "m2", "m3"],
        "user": UserRead.model_validate(user),
    }


@router.get("/secrets")
def get_superuser_messages(
    user: Annotated[
        User,
        Depends(current_active_superuser),
    ],
):
    return {
        "messages": ["secret_m1", "secret_m2", "secret_m3"],
        "user": UserRead.model_validate(user),
    }
