from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class MaritalStatus(Base):
    __tablename__ = "marital_statuses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # Связь с Employee
    employees = relationship("Employee", back_populates="marital_status")
