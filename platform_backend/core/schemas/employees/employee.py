# schemas/employee.py
from pydantic import BaseModel
from typing import Optional


class EmployeeBase(BaseModel):
    employee_number: int
    age: int
    gender_id: Optional[int] = None
    marital_status_id: Optional[int] = None
    education_level: int
    education_field_id: Optional[int] = None
    department_id: Optional[int] = None
    job_role_id: Optional[int] = None
    job_level: int
    attrition: bool
    business_travel_id: Optional[int] = None
    num_companies_worked: int
    total_working_years: int
    years_at_company: int
    years_in_current_role: int
    years_since_last_promotion: int
    years_with_curr_manager: int
    work_life_balance: int
    training_times_last_year: int


class EmployeeRead(EmployeeBase):
    employee_id: int

    class Config:
        orm_mode = True
