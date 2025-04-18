from core.gunicorn.logger import GunicornLogger


def get_app_options(
    host: str, port: int, workers: int, timeout: int, log_level: str, reload: bool
) -> dict:
    return {
        "accesslog": "-",
        "errorlog": "-",
        "bind": f"{host}:{port}",
        "timeout": timeout,
        "workers": workers,
        "loglevel": log_level,
        "logger_class": GunicornLogger,
        "worker_class": "uvicorn.workers.UvicornWorker",
        "reload": reload
    }
