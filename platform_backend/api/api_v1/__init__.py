from fastapi import APIRouter

from core.config import settings
from .users import router as users_router
from .auth import router as auth_router
from .messages import router as messages_router
from .employees import employees_router, employees_notifications_router
from api.api_v1.predict.predict import router as predict_router
from .integration.metabase.metabase import router as metabase_router
from .visualizations.sources import router as visualization_router
from .visualizations.query import router as query_router

router = APIRouter(
    prefix=settings.api.v1.prefix,
)
router.include_router(
    users_router,
    prefix=settings.api.v1.users,
    tags=["Users"],
)

router.include_router(
    auth_router,
    prefix=settings.api.v1.auth,
    tags=["Auth"],
)

router.include_router(
    messages_router,
    prefix=settings.api.v1.messages,
    tags=["Messages"],
)

router.include_router(
    employees_router,
    prefix=settings.api.v1.employees,
    tags=["Employees"],
)

router.include_router(
    employees_notifications_router,
    prefix=settings.api.v1.employees,
    tags=["Employees", "Notifications"],
)

router.include_router(
    predict_router,
    prefix=settings.api.v1.predict,
    tags=["Predict"],
)

router.include_router(
    metabase_router,
    prefix=settings.api.v1.metabase,
    tags=["Metabase"],
)

router.include_router(
    visualization_router,
    prefix=settings.api.v1.predefined_sources,
    tags=["Sources"],
)

router.include_router(
    query_router,
    prefix=settings.api.v1.query,
    tags=["Query"],
)
