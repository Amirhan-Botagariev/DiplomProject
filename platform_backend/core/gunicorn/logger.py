from logging import Formatter, Logger
from logging.handlers import TimedRotatingFileHandler
import os

from fastapi import FastAPI
from gunicorn.glogging import Logger

from core.config import settings


class GunicornLogger(Logger):
    def setup(self, cfg) -> None:
        super().setup(cfg)

        os.makedirs(settings.logging.log_dir, exist_ok=True)

        formatter = Formatter(
            fmt=settings.logging.log_format,
            datefmt=settings.logging.date_format
        )

        if settings.logging.file_logging:
            access_handler = TimedRotatingFileHandler(
                settings.logging.access_log_file,
                when="midnight",
                interval=1,
                backupCount=settings.logging.backup_count,
            )
            access_handler.setFormatter(formatter)
            access_handler.suffix = "%Y-%m-%d"
            self.access_log.addHandler(access_handler)

            error_handler = TimedRotatingFileHandler(
                settings.logging.error_log_file,
                when="midnight",
                interval=1,
                backupCount=settings.logging.backup_count,
            )
            error_handler.setFormatter(formatter)
            error_handler.suffix = "%Y-%m-%d"
            self.error_log.addHandler(error_handler)

        self.error_log.setLevel(settings.logging.log_level.upper())
        self.access_log.setLevel(settings.logging.log_level.upper())
