from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class BusinessTravel(Base):
    __tablename__ = "business_travel"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    employees = relationship(
        "Employee", back_populates="business_travel", lazy="joined"
    )
