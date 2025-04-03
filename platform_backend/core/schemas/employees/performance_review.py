from pydantic import BaseModel
from datetime import date
from typing import Optional


class PerformanceReviewBase(BaseModel):
    employee_id: int
    review_date: date
    score: float
    reviewer: Optional[str]


class PerformanceReviewRead(PerformanceReviewBase):
    id: int

    class Config:
        from_attributes = True
