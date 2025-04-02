from sqlalchemy.ext.asyncio import AsyncSession

from core.types.user_id import UserIdType
from libraries.fastapi_users.crud.user_crud import (
    SQLAlchemyBaseUserTable,
    SQLAlchemyUserDatabase,
)
from .base import Base
from .mixins.id_int_pk import IdIntMixin


class User(Base, IdIntMixin, SQLAlchemyBaseUserTable[UserIdType]):
    pass

    @classmethod
    def get_db(cls, session: AsyncSession):
        return SQLAlchemyUserDatabase(session, cls)
