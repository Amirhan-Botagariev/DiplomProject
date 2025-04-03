# schemas/employee.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EmployeeBase(BaseModel):
    gender_id: int
    marital_status_id: int
    education_level: int
    education_field_id: int
    department_id: int
    job_role_id: int
    job_level: int
    attrition: bool
    business_travel_id: int
    num_companies_worked: int
    total_working_years: int
    years_at_company: int
    years_in_current_role: int
    years_since_last_promotion: int
    years_with_curr_manager: int
    work_life_balance: int
    training_times_last_year: int


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    employee_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
