from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

from core.models.shared.user_role_enum import UserRole as AccessGroupRole


class Dashboard(BaseModel):
    dashboard_id: int
    dashboard_name: str
    creator_id: Optional[int]
    creator_name: Optional[str]
    our_user_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    access_user_ids: Optional[List[int]]
    access_groups: Optional[List[AccessGroupRole]]
    dashboard_url: Optional[str]
    category: Optional[str]
    tags: Optional[dict]

    class Config:
        orm_mode = True