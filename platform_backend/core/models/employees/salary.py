from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.models.base import Base


class Salary(Base):
    __tablename__ = "salaries"

    salary_id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    monthly_income = Column(DECIMAL(10, 2), nullable=False, CheckConstraint('monthly_income >= 0'))
    hourly_rate = Column(DECIMAL(10, 2), nullable=False, CheckConstraint('hourly_rate >= 0'))
    percent_salary_hike = Column(Integer, nullable=False, CheckConstraint('percent_salary_hike >= 0'))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    employee = relationship("Employee", back_populates="salaries")
