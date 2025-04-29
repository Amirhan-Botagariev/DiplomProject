# models/query_history.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func

from ..base import Base


class QueryHistory(Base):
    __tablename__ = "query_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    source_type = Column(String, nullable=False)  # "predefined", "custom", "builder"
    source_id = Column(Integer, nullable=True)  # если это predefined
    executed_query = Column(Text, nullable=False)
    executed_at = Column(DateTime(timezone=True), server_default=func.now())
    duration_ms = Column(Float, nullable=True)
    rows_returned = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)