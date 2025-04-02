import uuid
from typing import TYPE_CHECKING, Any, Optional, Generic
from fastapi_users.db.base import BaseUserDatabase
from fastapi_users_db_sqlalchemy.generics import GUID
from sqlalchemy import Boolean, ForeignKey, Integer, String, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, declared_attr, mapped_column
from sqlalchemy.sql import Select

from libraries.fastapi_users.schemas.base_user import U, UserIdType
from libraries.fastapi_users.models.protocols import OAuthAccountProtocol as OAP

UUID_ID = uuid.UUID


class SQLAlchemyBaseUserTable(Generic[UserIdType]):
    __tablename__ = "user"

    if TYPE_CHECKING:
        id: UUID_ID
        iin: str
        hashed_password: str
        is_active: bool
        is_superuser: bool
        is_verified: bool
    else:
        iin: Mapped[str] = mapped_column(
            String(length=12), unique=True, index=True, nullable=False
        )
        hashed_password: Mapped[str] = mapped_column(
            String(length=1024), nullable=False
        )
        is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
        is_superuser: Mapped[bool] = mapped_column(
            Boolean, default=False, nullable=False
        )
        is_verified: Mapped[bool] = mapped_column(
            Boolean, default=False, nullable=False
        )


class SQLAlchemyBaseUserTableUUID(SQLAlchemyBaseUserTable):
    if TYPE_CHECKING:
        id: UUID_ID
    else:
        id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)


class SQLAlchemyBaseOAuthAccountTable:
    __tablename__ = "oauth_account"

    if TYPE_CHECKING:
        id: UUID_ID
        oauth_name: str
        access_token: str
        expires_at: Optional[int]
        refresh_token: Optional[str]
        account_id: str
        account_iin: str
    else:
        oauth_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
        access_token: Mapped[str] = mapped_column(String(1024), nullable=False)
        expires_at: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
        refresh_token: Mapped[Optional[str]] = mapped_column(
            String(1024), nullable=True
        )
        account_id: Mapped[str] = mapped_column(String(320), index=True, nullable=False)
        account_iin: Mapped[str] = mapped_column(String(12), nullable=False)


class SQLAlchemyBaseOAuthAccountTableUUID(SQLAlchemyBaseOAuthAccountTable):
    if TYPE_CHECKING:
        id: UUID_ID
        user_id: UUID_ID
    else:
        id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)

        @declared_attr
        def user_id(cls) -> Mapped[UUID_ID]:
            return mapped_column(
                GUID,
                ForeignKey("user.id", ondelete="cascade"),
                nullable=False,
            )


class SQLAlchemyUserDatabase(Generic[U], BaseUserDatabase[U, UUID_ID]):
    session: AsyncSession
    user_table: type[U]
    oauth_account_table: Optional[type[SQLAlchemyBaseOAuthAccountTable]]

    def __init__(
        self,
        session: AsyncSession,
        user_table: type[U],
        oauth_account_table: Optional[type[SQLAlchemyBaseOAuthAccountTable]] = None,
    ):
        self.session = session
        self.user_table = user_table
        self.oauth_account_table = oauth_account_table

    async def get(self, id: UUID_ID) -> Optional[U]:
        statement = select(self.user_table).where(self.user_table.id == id)
        return await self._get_user(statement)

    async def get_by_iin(self, iin: str) -> Optional[U]:
        statement = select(self.user_table).where(self.user_table.iin == iin)
        return await self._get_user(statement)

    async def get_by_oauth_account(self, oauth: str, account_id: str) -> Optional[U]:
        if self.oauth_account_table is None:
            raise NotImplementedError()

        statement = (
            select(self.user_table)
            .join(self.oauth_account_table)
            .where(self.oauth_account_table.oauth_name == oauth)  # type: ignore
            .where(self.oauth_account_table.account_id == account_id)  # type: ignore
        )
        return await self._get_user(statement)

    async def create(self, create_dict: dict[str, Any]) -> U:
        user = self.user_table(**create_dict)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def update(self, user: U, update_dict: dict[str, Any]) -> U:
        for key, value in update_dict.items():
            setattr(user, key, value)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def delete(self, user: U) -> None:
        await self.session.delete(user)
        await self.session.commit()

    async def add_oauth_account(self, user: U, create_dict: dict[str, Any]) -> U:
        if self.oauth_account_table is None:
            raise NotImplementedError()

        await self.session.refresh(user)
        oauth_account = self.oauth_account_table(**create_dict)
        self.session.add(oauth_account)
        user.oauth_accounts.append(oauth_account)  # type: ignore
        self.session.add(user)

        await self.session.commit()
        return user

    async def update_oauth_account(
        self, user: U, oauth_account: OAP, update_dict: dict[str, Any]
    ) -> U:
        if self.oauth_account_table is None:
            raise NotImplementedError()

        for key, value in update_dict.items():
            setattr(oauth_account, key, value)
        self.session.add(oauth_account)
        await self.session.commit()
        return user

    async def _get_user(self, statement: Select) -> Optional[U]:
        results = await self.session.execute(statement)
        return results.unique().scalar_one_or_none()
