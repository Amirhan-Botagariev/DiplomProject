#!/bin/bash
set -e

poetry run alembic upgrade head

service cron start

poetry run python run_main.py