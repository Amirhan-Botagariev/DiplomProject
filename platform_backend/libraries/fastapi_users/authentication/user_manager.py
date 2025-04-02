import logging
from typing import Optional

from fastapi import Request
from fastapi_users import BaseUserManager, exceptions
from fastapi_users.exceptions import InvalidPasswordException

from core.config import settings
from core.models import User
from libraries.fastapi_users.crud.user_crud import SQLAlchemyUserDatabase, UUID_ID
from libraries.fastapi_users.schemas.base_user import BaseUserCreate

log = logging.getLogger(__name__)


class UserManager(BaseUserManager[User, UUID_ID]):
    reset_password_token_secret = settings.access_token.reset_password_token_secret
    verification_token_secret = settings.access_token.verification_token_secret

    def __init__(self, user_db: SQLAlchemyUserDatabase):
        super().__init__(user_db)
        self.user_db: SQLAlchemyUserDatabase = user_db

    async def authenticate(self, credentials: dict[str, str]) -> Optional[User]:
        iin = credentials.get("username")
        password = credentials.get("password")

        if iin is None or password is None:
            return None
        user = await self.user_db.get_by_iin(iin)

        if user is None or not user.is_active:
            return None

        is_valid, updated_hash = self.password_helper.verify_and_update(
            password, user.hashed_password
        )

        if not is_valid:
            return None

        if updated_hash is not None:
            await self.user_db.update(
                user, update_dict={"hashed_password": updated_hash}
            )

        return user  # type: ignore

    async def validate_password(
        self, password: str, user: Optional[User] = None
    ) -> None:
        if len(password) < 8:
            raise InvalidPasswordException(
                reason="Пароль должен быть не короче 8 символов."
            )

        if password.isdigit() or password.isalpha():
            raise InvalidPasswordException(
                reason="Пароль должен содержать и буквы, и цифры."
            )

        if " " in password:
            raise InvalidPasswordException(reason="Пароль не должен содержать пробелы.")

    async def create(
        self,
        user_create: BaseUserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> User:
        existing_user = await self.user_db.get_by_iin(user_create.iin)
        if existing_user is not None:
            raise exceptions.UserAlreadyExists()

        await self.validate_password(user_create.password)

        user_dict = user_create.create_update_dict()
        user_dict["hashed_password"] = self.password_helper.hash(user_create.password)
        user_dict.pop("password", None)

        created_user = await self.user_db.create(user_dict)
        await self.on_after_register(created_user, request)
        return created_user

    def parse_id(self, user_id: str) -> int:
        return int(user_id)

    async def on_after_register(
        self,
        user: User,
        request: Optional["Request"] = None,
    ):
        log.warning(
            "User %r has registered.",
            user.id,
        )

    async def on_after_forgot_password(
        self,
        user: User,
        token: str,
        request: Optional["Request"] = None,
    ):
        log.warning(
            "User %r has forgot their password. Reset token: %r",
            user.id,
            token,
        )

    async def on_after_request_verify(
        self,
        user: User,
        token: str,
        request: Optional["Request"] = None,
    ):
        log.warning(
            "Verification requested for user %r. Verification token: %r",
            user.id,
            token,
        )
