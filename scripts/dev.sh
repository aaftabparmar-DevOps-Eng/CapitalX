#!/usr/bin/env bash
# Start all services in development mode
ROOT="$(dirname "$0")/.."
echo "Starting Docker services (Postgres + Redis)..."
docker compose -f "$ROOT/docker-compose.yml" up -d postgres redis
sleep 3
echo "Starting backend..."
(cd "$ROOT/backend" && npm run start:dev) &
echo "Starting frontend..."
(cd "$ROOT/frontend" && npm run dev) &
wait
