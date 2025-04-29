from typing import Optional

from pydantic import BaseModel


class PredefinedSourceShort(BaseModel):
    id: int
    name: str
    description: Optional[str]
    chart_type: str


class PredefinedSourceDetail(BaseModel):
    id: int
    name: str
    description: Optional[str]
    query: str
    available_filters: Optional[dict]
    chart_type: str
