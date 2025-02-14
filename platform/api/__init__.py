from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPBearer

from .api_v1 import router as router_api_v1

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(
    dependencies=[Depends(http_bearer)],
)
router.include_router(router_api_v1)
