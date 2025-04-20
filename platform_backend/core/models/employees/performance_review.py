from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, Date, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.models.base import Base


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    review_id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    review_date = Column(Date, default=func.current_date(), nullable=False)
    performance_rating = Column(Integer, nullable=False, CheckConstraint('performance_rating BETWEEN 1 AND 5'))
    job_involvement = Column(Integer, nullable=False, CheckConstraint('job_involvement BETWEEN 1 AND 4'))
    job_satisfaction = Column(Integer, nullable=False, CheckConstraint('job_satisfaction BETWEEN 1 AND 4'))
    relationship_satisfaction = Column(Integer, nullable=False, CheckConstraint('relationship_satisfaction BETWEEN 1 AND 4'))
    environment_satisfaction = Column(Integer, nullable=False, CheckConstraint('environment_satisfaction BETWEEN 1 AND 4'))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    employee = relationship("Employee", back_populates="performance_reviews")
