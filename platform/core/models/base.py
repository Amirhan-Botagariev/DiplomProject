from sqlalchemy.orm import Mapped, DeclarativeBase, mapped_column, declared_attr


class Base(DeclarativeBase):
    __abstract__ = True

    id: Mapped[int] = mapped_column(primary_key=True)

    @classmethod
    @declared_attr.directive
    def __tablename__(cls):
        return f"{cls.__name__.lower()}s"
