from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Date, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.models.base import Base


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    review_date = Column(Date, default=func.current_date(), nullable=False)
    performance_rating = Column(Integer, CheckConstraint('performance_rating BETWEEN 1 AND 5'), nullable=False)
    job_involvement = Column(Integer, CheckConstraint('job_involvement BETWEEN 1 AND 4'), nullable=False)
    job_satisfaction = Column(Integer, CheckConstraint('job_satisfaction BETWEEN 1 AND 4'), nullable=False)
    relationship_satisfaction = Column(Integer, CheckConstraint('relationship_satisfaction BETWEEN 1 AND 4'), nullable=False)
    environment_satisfaction = Column(Integer, CheckConstraint('environment_satisfaction BETWEEN 1 AND 4'), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    employee = relationship("Employee", back_populates="performance_reviews")
