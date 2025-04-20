from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class BusinessTravel(Base):
    __tablename__ = "business_travel"

    business_travel_id = Column(Integer, primary_key=True, index=True)
    travel_type = Column(String(50), nullable=False, unique=True)

    employees = relationship("Employee", back_populates="business_travel", lazy="joined")
