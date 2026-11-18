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

echo ">>> Checking if local database already contains tables..."
TABLE_COUNT=$(docker exec "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null || echo "0")
TABLE_COUNT=${TABLE_COUNT:-0}

if [ "$TABLE_COUNT" -gt 0 ] && [ "$1" != "--force" ] && [ "$2" != "--force" ]; then
    echo ">>> Local database already contains $TABLE_COUNT tables. Seed skipped (use --force to overwrite)."
    exit 0
fi

echo ">>> Local database is empty. Streaming initial schema and data from Neon Cloud DB..."
docker run --rm postgres:16-alpine pg_dump "$NEON_URL" --no-owner --no-acl | docker exec -i "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME" > /dev/null 2>&1 || true

echo ">>> [SUCCESS] Local database seeded from Neon Cloud DB!"
