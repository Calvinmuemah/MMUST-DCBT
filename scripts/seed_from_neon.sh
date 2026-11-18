#!/usr/bin/env bash
# =============================================================================
# MMUST DCBT - Seed Local PostgreSQL DB from Neon Cloud DB (Initial Setup)
# Usage: bash scripts/seed_from_neon.sh [--force]
# =============================================================================

set -e

APP_DIR="/var/www/mmust-dcbt"
LOCAL_CONTAINER="mmust_dcbt_db"
DB_NAME="mmust_dcbt"

NEON_URL="${1}"
if [ -z "$NEON_URL" ] || [ "$NEON_URL" = "--force" ]; then
    if [ -f "$APP_DIR/.env" ]; then
        NEON_URL=$(grep "^NEON_DATABASE_URL=" "$APP_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    fi
fi

if [ -z "$NEON_URL" ]; then
    echo "[NOTICE] NEON_DATABASE_URL is not set. Skipping initial seed."
    exit 0
fi

if ! docker ps --format '{{.Names}}' | grep -q "^${LOCAL_CONTAINER}$"; then
    echo "[ERROR] Local database container '${LOCAL_CONTAINER}' is not running."
    exit 1
fi

echo ">>> Checking if local database already contains the 'users' table..."
HAS_USERS=$(docker exec "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME" -tAc "SELECT to_regclass('public.users');" 2>/dev/null | tr -d '[:space:]' || echo "")

if [ "$HAS_USERS" = "users" ] && [ "$1" != "--force" ] && [ "$2" != "--force" ]; then
    echo ">>> 'users' table already exists in local database. Seed skipped (use --force to overwrite)."
    exit 0
fi

echo ">>> Streaming schema and data from Neon Cloud DB into local database..."
docker run --rm postgres:17-alpine pg_dump "$NEON_URL" --no-owner --no-acl --clean --if-exists | docker exec -i "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME"

echo ">>> [SUCCESS] Local database seeded from Neon Cloud DB!"
