from collections.abc import Sequence, Callable, Awaitable
from typing import Generic, Optional, TypeVar

from fastapi_users import schemas
from fastapi_users.authentication import AuthenticationBackend, Authenticator
from fastapi_users.jwt import SecretType

# Оригинальные
from fastapi_users.router import (
    get_users_router,
)

from libraries.fastapi_users.authentication.user_manager import UserManager
from libraries.fastapi_users.models.protocols import UserProtocol

# Кастомные роутеры
from libraries.fastapi_users.routers.auth import get_auth_router
from libraries.fastapi_users.routers.register import get_register_router

try:
    from httpx_oauth.oauth2 import BaseOAuth2
    from fastapi_users.router.oauth import get_oauth_router, get_oauth_associate_router
except ModuleNotFoundError:
    BaseOAuth2 = type  # type: ignore


# Типизация
UP = TypeVar("UP", bound=UserProtocol)
ID = TypeVar("ID")


class FastAPIUsers(Generic[UP, ID]):
    def __init__(
        self,
        get_user_manager: Callable[[], Awaitable[UserManager]],
        auth_backends: Sequence[AuthenticationBackend[UP, ID]],
    ):
        self.get_user_manager = get_user_manager
        self.authenticator = Authenticator(auth_backends, get_user_manager)
        self.current_user = self.authenticator.current_user

    def get_auth_router(
        self,
        backend: AuthenticationBackend[UP, ID],
        requires_verification: bool = False,
    ):
        return get_auth_router(
            backend=backend,
            get_user_manager=self.get_user_manager,
            authenticator=self.authenticator,
            requires_verification=requires_verification,
        )

    def get_register_router(
        self,
        user_schema: type[schemas.U],
        user_create_schema: type[schemas.UC],
    ):
        return get_register_router(
            get_user_manager=self.get_user_manager,
            user_schema=user_schema,
            user_create_schema=user_create_schema,
        )

    def get_users_router(
        self,
        user_schema: type[schemas.U],
        user_update_schema: type[schemas.UU],
        requires_verification: bool = False,
    ):
        return get_users_router(
            get_user_manager=self.get_user_manager,
            user_schema=user_schema,
            user_update_schema=user_update_schema,
            authenticator=self.authenticator,
            requires_verification=requires_verification,
        )

    def get_oauth_router(
        self,
        oauth_client: BaseOAuth2,
        backend: AuthenticationBackend[UP, ID],
        state_secret: SecretType,
        redirect_url: Optional[str] = None,
        associate_by_email: bool = False,
        is_verified_by_default: bool = False,
    ):
        return get_oauth_router(
            oauth_client,
            backend,
            self.get_user_manager,
            state_secret,
            redirect_url,
            associate_by_email,
            is_verified_by_default,
        )

    def get_oauth_associate_router(
        self,
        oauth_client: BaseOAuth2,
        user_schema: type[schemas.U],
        state_secret: SecretType,
        redirect_url: Optional[str] = None,
        requires_verification: bool = False,
    ):
        return get_oauth_associate_router(
            oauth_client,
            self.authenticator,
            self.get_user_manager,
            user_schema,
            state_secret,
            redirect_url,
            requires_verification,
        )
