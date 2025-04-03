# models/employee.py
from sqlalchemy import Column, Integer, ForeignKey, Boolean, TIMESTAMP
from sqlalchemy.orm import relationship
from core.models.base import Base


class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(Integer, primary_key=True, index=True)
    gender_id = Column(Integer, ForeignKey("genders.gender_id"))
    marital_status_id = Column(
        Integer, ForeignKey("marital_statuses.marital_status_id")
    )
    education_level = Column(Integer)
    education_field_id = Column(
        Integer, ForeignKey("education_fields.education_field_id")
    )
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    job_role_id = Column(Integer, ForeignKey("job_roles.job_role_id"))
    job_level = Column(Integer)
    attrition = Column(Boolean)
    business_travel_id = Column(
        Integer, ForeignKey("business_travel.business_travel_id")
    )
    num_companies_worked = Column(Integer)
    total_working_years = Column(Integer)
    years_at_company = Column(Integer)
    years_in_current_role = Column(Integer)
    years_since_last_promotion = Column(Integer)
    years_with_curr_manager = Column(Integer)
    work_life_balance = Column(Integer)
    training_times_last_year = Column(Integer)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

    # relationships (если понадобится)
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
