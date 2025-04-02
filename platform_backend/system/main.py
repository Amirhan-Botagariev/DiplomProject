import logging

from starlette.middleware.cors import CORSMiddleware

from api import router as api_router
from core.config import settings
from create_fastapi_app import create_app

logging.basicConfig(
    format=settings.logging.log_format,
)

main_app = create_app(
    create_custom_static_urls=False,
)

main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

main_app.include_router(
    api_router,
    prefix=settings.api.prefix,
)

if __name__ == "__main__":
    uvicorn.run(
        "main:main_app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
    )
