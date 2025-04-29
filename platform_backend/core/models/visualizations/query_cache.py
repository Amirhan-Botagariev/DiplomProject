# models/query_cache.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from ..base import Base


class QueryCache(Base):
    __tablename__ = "query_cache"

    id = Column(Integer, primary_key=True, index=True)
    query_hash = Column(String, unique=True, index=True, nullable=False)
    result_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
