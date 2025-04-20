from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.models.base import Base


class JobRole(Base):
    __tablename__ = "job_roles"

    job_role_id = Column(Integer, primary_key=True, index=True)
    job_role_name = Column(String(50), nullable=False, unique=True)

    employees = relationship("Employee", back_populates="job_role", lazy="joined")
