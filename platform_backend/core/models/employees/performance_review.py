from sqlalchemy import Column, Integer, Float, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from core.models.base import Base


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(
        Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    review_date = Column(Date, nullable=False)
    score = Column(Float, nullable=False)
    reviewer = Column(String, nullable=True)

    employee = relationship(
        "Employee", back_populates="performance_reviews", lazy="joined"
    )
