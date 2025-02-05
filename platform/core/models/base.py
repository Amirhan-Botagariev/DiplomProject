from sqlalchemy import MetaData
from sqlalchemy.orm import Mapped, DeclarativeBase, mapped_column, declared_attr

from core.config import settings


class Base(DeclarativeBase):
    __abstract__ = True

    metadata = MetaData(
        naming_convention=settings.db.naming_convention,
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    @classmethod
    @declared_attr
    def __tablename__(cls):
        return f"{cls.__name__.lower()}s"
