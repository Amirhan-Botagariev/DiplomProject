# models/employee.py
from sqlalchemy import Column, Integer, ForeignKey, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.models.base import Base


class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(Integer, primary_key=True, index=True)
    gender_id = Column(
        Integer, ForeignKey("genders.gender_id"), nullable=False, index=True
    )
    marital_status_id = Column(
        Integer,
        ForeignKey("marital_statuses.marital_status_id"),
        nullable=False,
        index=True,
    )
    education_level = Column(Integer, nullable=False)
    education_field_id = Column(
        Integer,
        ForeignKey("education_fields.education_field_id"),
        nullable=False,
        index=True,
    )
    department_id = Column(
        Integer, ForeignKey("departments.department_id"), nullable=False, index=True
    )
    job_role_id = Column(
        Integer, ForeignKey("job_roles.job_role_id"), nullable=False, index=True
    )
    job_level = Column(Integer, nullable=False)
    attrition = Column(Boolean, nullable=False)
    business_travel_id = Column(
        Integer,
        ForeignKey("business_travel.business_travel_id"),
        nullable=False,
        index=True,
    )
    num_companies_worked = Column(Integer, nullable=False)
    total_working_years = Column(Integer, nullable=False)
    years_at_company = Column(Integer, nullable=False)
    years_in_current_role = Column(Integer, nullable=False)
    years_since_last_promotion = Column(Integer, nullable=False)
    years_with_curr_manager = Column(Integer, nullable=False)
    work_life_balance = Column(Integer, nullable=False)
    training_times_last_year = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # relationships
    department = relationship("Department", back_populates="employees", lazy="joined")
    gender = relationship("Gender", back_populates="employees", lazy="joined")
    education_field = relationship(
        "EducationField", back_populates="employees", lazy="joined"
    )
    marital_status = relationship(
        "MaritalStatus", back_populates="employees", lazy="joined"
    )
    job_role = relationship("JobRole", back_populates="employees", lazy="joined")
    performance_reviews = relationship(
        "PerformanceReview", back_populates="employee", cascade="all, delete"
    )
    salaries = relationship("Salary", back_populates="employee", cascade="all, delete")
    business_travel = relationship(
        "BusinessTravel", back_populates="employees", lazy="joined"
    )
