from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class EducationField(Base):
    __tablename__ = "education_fields"

    education_field_id = Column(Integer, primary_key=True, index=True)
    education_field_name = Column(String, nullable=False)

    employees = relationship("Employee", back_populates="education_field")
