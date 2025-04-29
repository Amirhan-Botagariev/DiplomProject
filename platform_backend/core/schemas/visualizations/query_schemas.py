from pydantic import BaseModel
from typing import Dict, Optional


class ExecutePredefinedQueryRequest(BaseModel):
    source_id: int
    filters: Optional[Dict[str, str]] = None