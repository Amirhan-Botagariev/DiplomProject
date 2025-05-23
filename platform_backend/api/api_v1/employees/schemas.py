from typing import Optional, List
from pydantic import BaseModel, Field

class EmployeeFilterParams(BaseModel):
    department: Optional[str] = Field(None, description="Department name")
    attrition: Optional[bool] = Field(None, description="Attrition flag")
    education_level: Optional[int] = Field(None, description="Education level")
    education_field: Optional[str] = Field(None, description="Education field name")
    gender: Optional[str] = Field(None, description="Gender name")
    marital_status: Optional[str] = Field(None, description="Marital status name")
    job_role: Optional[str] = Field(None, description="Job role name")
    years_at_company_min: Optional[int] = Field(None, description="Min years at company")
    years_at_company_max: Optional[int] = Field(None, description="Max years at company")
    performance_rating: Optional[int] = Field(None, description="Performance rating")
    risk_min: Optional[float] = Field(None, description="Min attrition risk (%)")
    risk_max: Optional[float] = Field(None, description="Max attrition risk (%)")
    age_min: Optional[int] = Field(None, description="Min age")
    age_max: Optional[int] = Field(None, description="Max age")

class EmployeeOut(BaseModel):
    employee_id: int
    employee_number: Optional[str]
    full_name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    marital_status: Optional[str]
    education_level: Optional[int]
    education_field: Optional[str]
    department: Optional[str]
    job_role: Optional[str]
    job_level: Optional[int]
    attrition: Optional[bool]
    business_travel: Optional[str]
    num_companies_worked: Optional[int]
    total_working_years: Optional[int]
    years_at_company: Optional[int]
    years_in_current_role: Optional[int]
    years_since_last_promotion: Optional[int]
    years_with_curr_manager: Optional[int]
    work_life_balance: Optional[int]
    training_times_last_year: Optional[int]
    performance_rating: Optional[int]
    job_involvement: Optional[int]
    job_satisfaction: Optional[int]
    relationship_satisfaction: Optional[int]
    environment_satisfaction: Optional[int]
    review_date: Optional[str]
    risk: Optional[float]
    created_at: Optional[str]
    updated_at: Optional[str]

class EmployeeListResponse(BaseModel):
    employees: List[EmployeeOut]
    total: int
