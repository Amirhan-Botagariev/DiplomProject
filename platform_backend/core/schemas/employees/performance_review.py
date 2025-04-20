from pydantic import BaseModel
from datetime import date


class PerformanceReviewBase(BaseModel):
    performance_rating: int
    job_involvement: int
    job_satisfaction: int
    relationship_satisfaction: int
    environment_satisfaction: int


class PerformanceReviewRead(PerformanceReviewBase):
    review_id: int
    employee_id: int
    review_date: date

    class Config:
        orm_mode = True
