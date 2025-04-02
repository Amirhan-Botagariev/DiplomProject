from typing import cast
from uuid import UUID

from fastapi_users.manager import UserManagerDependency

from core.models import User
from libraries.fastapi_users.core import FastAPIUsers
from libraries.fastapi_users.dependencies.authentication import authentication_backend
from libraries.fastapi_users.dependencies.authentication.user_manager import (
    get_user_manager,
)  # твоя функция

fastapi_users = FastAPIUsers[User, UUID](
    get_user_manager=cast(UserManagerDependency[User, UUID], get_user_manager),
    auth_backends=[authentication_backend],
)

current_active_user = fastapi_users.current_user(
    active=True,
)

current_active_superuser = fastapi_users.current_user(
    active=True,
    superuser=True,
)
