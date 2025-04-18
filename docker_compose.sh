#!/bin/bash
set -a
source sys/env/.env.metabase
source sys/env/.env.db
source sys/env/.env.common
set +a

docker compose up --build
docker compose up -d