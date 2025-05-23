from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.sql import func
from ..base import Base


class DashboardConfiguration(Base):
    __tablename__ = "dashboard_configurations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    route_id = Column(String, nullable=True, unique=True, index=True)
    description = Column(Text, nullable=True)
    graphs = Column(JSON, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
