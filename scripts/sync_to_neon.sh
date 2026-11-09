#!/usr/bin/env bash
# =============================================================================
# MMUST DCBT - Daily Database Backup & Neon Cloud Sync Script
# 1. Creates a local compressed snapshot on the VPS (/var/backups/mmust-dcbt/)
# 2. Streams the latest database state into Neon Cloud DB for disaster recovery
# 3. Retains last 7 days of local backups and logs to /var/log/mmust_neon_sync.log
# =============================================================================

set -e

APP_DIR="/var/www/mmust-dcbt"
BACKUP_DIR="/var/backups/mmust-dcbt"
DATE=$(date +%Y%m%d_%H%M%S)
LOCAL_CONTAINER="mmust_dcbt_db"
DB_NAME="mmust_dcbt"
LOG_FILE="/var/log/mmust_neon_sync.log"

mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=================================================="
log " Starting MMUST DCBT Daily Database Sync..."
log "=================================================="

# 1. Determine Neon Database URL
if [ -n "$1" ]; then
    NEON_URL="$1"
elif [ -f "$APP_DIR/.env" ]; then
    NEON_URL=$(grep "^NEON_DATABASE_URL=" "$APP_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
    if [ -z "$NEON_URL" ]; then
        CANDIDATE=$(grep "^DATABASE_URL=" "$APP_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
        if [[ "$CANDIDATE" == *"neon.tech"* ]]; then
            NEON_URL="$CANDIDATE"
        fi
    fi
fi

# 2. Verify local database container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${LOCAL_CONTAINER}$"; then
    log "[ERROR] Local database container '${LOCAL_CONTAINER}' is not running. Aborting sync."
    exit 1
fi

# 3. Step 1: Create local compressed backup
BACKUP_FILE="$BACKUP_DIR/mmust_dcbt_${DATE}.sql.gz"
log "Creating local compressed backup: $BACKUP_FILE..."

docker exec "$LOCAL_CONTAINER" pg_dump -U postgres --clean --if-exists "$DB_NAME" | gzip > "$BACKUP_FILE"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log "Local backup completed successfully ($FILE_SIZE)."

# Prune local backups older than 7 days
find "$BACKUP_DIR" -name "mmust_dcbt_*.sql.gz" -mtime +7 -delete
log "Pruned local backup files older than 7 days."

# 4. Step 2: Stream dump to Neon Cloud PostgreSQL
if [ -n "$NEON_URL" ]; then
    log "Streaming backup to Neon Cloud Database (Disaster Recovery)..."

    # Uses ephemeral postgres container so host doesn't need postgres-client installed
    gunzip -c "$BACKUP_FILE" | docker run --rm -i postgres:16-alpine psql "$NEON_URL" > /dev/null 2>&1

    log "Successfully synced latest database to Neon Cloud DB!"
    log "Neon compute will now automatically spin down and sleep to save quota."
else
    log "[NOTICE] No Neon connection URL found. Local snapshot saved, but Neon sync was skipped."
    log "To enable Neon sync, set NEON_DATABASE_URL in $APP_DIR/.env or pass it as an argument."
fi

log "=================================================="
log " MMUST DCBT Daily Sync Finished Successfully!"
log "=================================================="
