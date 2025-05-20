from typing import Optional, List, Literal
from pydantic import BaseModel


class GraphConfig(BaseModel):
    name: str
    description: Optional[str] = None
    query_type: str
    query: str
    chart_type: Literal[
        "line",
        "bar",
        "pie",
        "scatter",
        "area",
        "histogram",
        "gauge",
        "stacked_bar",
    ]
    legend: str
    ox_name: Optional[str] = None
    oy_name: Optional[str] = None


class DashboardConfigurationBase(BaseModel):
    name: str
    route_id: str
    description: Optional[str] = None
    graphs: List[GraphConfig]


class DashboardConfigurationCreate(DashboardConfigurationBase):
    pass


class DashboardConfigurationUpdate(DashboardConfigurationBase):
    pass
