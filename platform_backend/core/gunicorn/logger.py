from logging import Formatter
from logging.handlers import RotatingFileHandler
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
            access_handler = RotatingFileHandler(
                settings.logging.access_log_file,
                maxBytes=settings.logging.max_file_size_mb * 1024 * 1024,
                backupCount=settings.logging.backup_count
            )
            access_handler.setFormatter(formatter)
            self.access_log.addHandler(access_handler)

            # Configure error log
            error_handler = RotatingFileHandler(
                settings.logging.error_log_file,
                maxBytes=settings.logging.max_file_size_mb * 1024 * 1024,
                backupCount=settings.logging.backup_count
            )
            error_handler.setFormatter(formatter)
            self.error_log.addHandler(error_handler)

        if settings.logging.console_logging:
            self._set_handler(
                log=self.access_log,
                output=cfg.accesslog or "-",
                fmt=formatter,
            )
            self._set_handler(
                log=self.error_log,
                output=cfg.errorlog or "-",
                fmt=formatter,
            )

        self.error_log.setLevel(settings.logging.log_level.upper())
        self.access_log.setLevel(settings.logging.log_level.upper())
