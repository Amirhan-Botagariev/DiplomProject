from sqlalchemy import Column, Integer, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from core.models.base import Base


class Salary(Base):
    __tablename__ = "salaries"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(
        Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    amount = Column(Float, nullable=False)
    effective_date = Column(Date, nullable=False)

    employee = relationship("Employee", back_populates="salaries", lazy="joined")
