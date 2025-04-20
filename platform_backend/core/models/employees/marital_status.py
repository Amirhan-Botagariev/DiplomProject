# models/marital_status.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class MaritalStatus(Base):
    __tablename__ = "marital_statuses"

    marital_status_id = Column(Integer, primary_key=True, index=True)
    marital_status_name = Column(String(15), nullable=False, unique=True)

    # Relationship to employees
    employees = relationship("Employee", back_populates="marital_status", lazy="joined")
