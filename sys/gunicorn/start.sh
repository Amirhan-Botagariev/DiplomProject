#!/bin/bash

# Запускаем cron
service cron start

# Запускаем FastAPI из system/run
poetry run python system/run