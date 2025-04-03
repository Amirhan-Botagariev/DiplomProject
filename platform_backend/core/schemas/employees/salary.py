from pydantic import BaseModel
from datetime import date


class SalaryBase(BaseModel):
    employee_id: int
    amount: float
    effective_date: date


class SalaryRead(SalaryBase):
    id: int

    class Config:
        from_attributes = True
