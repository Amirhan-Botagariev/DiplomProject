from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models import Base


class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(50), nullable=False)

    employees = relationship("Employee", back_populates="department")
