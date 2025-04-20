from pydantic import BaseModel


class SalaryBase(BaseModel):
    monthly_income: float
    hourly_rate: float
    percent_salary_hike: int


class SalaryRead(SalaryBase):
    salary_id: int
    employee_id: int

    class Config:
        orm_mode = True
