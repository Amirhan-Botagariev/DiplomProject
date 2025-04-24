import logging
import os
from logging.handlers import RotatingFileHandler

from starlette.middleware.cors import CORSMiddleware

from api import router as api_router
from core.config import settings
from create_fastapi_app import create_app

def setup_logging():
    os.makedirs(settings.logging.log_dir, exist_ok=True)

    formatter = logging.Formatter(
        fmt=settings.logging.log_format,
        datefmt=settings.logging.date_format
    )

    handlers = []
    
    if settings.logging.file_logging:
        file_handler = RotatingFileHandler(
            settings.logging.log_file,
            maxBytes=settings.logging.max_file_size_mb * 1024 * 1024,
            backupCount=settings.logging.backup_count
        )
        file_handler.setFormatter(formatter)
        handlers.append(file_handler)

    logging.basicConfig(
        level=settings.logging.log_level.upper(),
        handlers=handlers
    )

    logger = logging.getLogger(__name__)
    logger.info("Logging system initialized")

setup_logging()

main_app = create_app(
    create_custom_static_urls=False,
)

@main_app.get("/test-logging")
async def test_logging():
    logger = logging.getLogger(__name__)
    logger.debug("This is a debug message")
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    return {"message": "Logging test completed"}

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
    import uvicorn
    uvicorn.run(
        "main:main_app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
    )
