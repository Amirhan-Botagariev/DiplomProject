from .base import Base
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable


class User(Base, SQLAlchemyBaseUserTable[int]):
    pass
