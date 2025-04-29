# models/predefined_source.py
from sqlalchemy import Column, Integer, String, Text, JSON
from ..base import Base
import enum
from sqlalchemy import Enum as SQLAlchemyEnum


class ChartTypeEnum(str, enum.Enum):
    table = "table"
    bar = "bar"
    line = "line"
    pie = "pie"
    doughnut = "doughnut"
    metric = "metric"
    boxplot = "boxplot"
    map = "map"


class PredefinedSource(Base):
    __tablename__ = "predefined_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    query = Column(Text, nullable=False)
    available_filters = Column(JSON, nullable=True)
    group_by = Column(String, nullable=True)
    chart_type = Column(SQLAlchemyEnum(ChartTypeEnum), nullable=True)

