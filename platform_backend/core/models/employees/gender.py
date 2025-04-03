from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class Gender(Base):
    __tablename__ = "genders"

    gender_id = Column(Integer, primary_key=True, index=True)
    gender_name = Column(String, nullable=False)

    # Связь с Employee
    employees = relationship("Employee", back_populates="gender")
