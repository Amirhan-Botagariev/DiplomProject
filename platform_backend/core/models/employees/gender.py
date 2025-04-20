# models/gender.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class Gender(Base):
    __tablename__ = "genders"

    gender_id = Column(Integer, primary_key=True, index=True)
    gender_name = Column(String(10), nullable=False, unique=True)

    # Relationship to employees
    employees = relationship("Employee", back_populates="gender", lazy="joined")
