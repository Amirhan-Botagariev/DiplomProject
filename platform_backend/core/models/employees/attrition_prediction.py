from sqlalchemy import Column, Integer, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from core.models.base import Base


class AttritionPrediction(Base):
    __tablename__ = "attrition_predictions"

    employee_number = Column(Integer, primary_key=True)
    predicted_attrition_prob = Column(DECIMAL(5, 4), nullable=False)
    predicted_at = Column(TIMESTAMP, default=func.now(), nullable=False)
