from pydantic import BaseModel
from datetime import datetime


class AttritionPredictionBase(BaseModel):
    predicted_attrition_prob: float


class AttritionPredictionRead(AttritionPredictionBase):
    employee_number: int
    predicted_at: datetime

    class Config:
        orm_mode = True
