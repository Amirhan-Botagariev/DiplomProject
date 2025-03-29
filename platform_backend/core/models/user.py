from .base import Base
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from core.types.user_id import UserIdType
from sqlalchemy.ext.asyncio import AsyncSession

from .mixins.id_int_pk import IdIntMixin


class User(Base, IdIntMixin, SQLAlchemyBaseUserTable[UserIdType]):
    pass

    @classmethod
    def get_db(cls, session: AsyncSession):
        return SQLAlchemyUserDatabase(session, cls)
