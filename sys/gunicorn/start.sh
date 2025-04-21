#!/bin/bash
set -e

PROJECT_DIR="/platform"
BACKEND_DIR="$PROJECT_DIR/platform_backend"
ALEMBIC_INI="$BACKEND_DIR/alembic.ini"

export PYTHONPATH="$PROJECT_DIR"

poetry --directory "$BACKEND_DIR" run alembic -c "$ALEMBIC_INI" upgrade head

service cron start

poetry --directory "$BACKEND_DIR" run python -m platform_backend.system.load_data_script.load_data

poetry --directory "$BACKEND_DIR" run python -m platform_backend.run_main