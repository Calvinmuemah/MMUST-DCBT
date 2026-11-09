#!/usr/bin/env bash
# =============================================================================
# MMUST DCBT - Instant Rollback Script
# Reverts both the Backend Container (Blue <-> Green) and Frontend Releases
# Execution Time: ~1-2 Seconds | Zero Downtime
# =============================================================================

set -e

APP_DIR="/var/www/mmust-dcbt"
cd "$APP_DIR"

echo "=================================================="
echo " Starting Instant Rollback for MMUST DCBT..."
echo "=================================================="

# 1. Determine currently active backend slot
UPSTREAM_FILE="$APP_DIR/upstream.conf"

if [ ! -f "$UPSTREAM_FILE" ]; then
    echo "server 127.0.0.1:5001;" > "$UPSTREAM_FILE"
fi

if grep -q "5001" "$UPSTREAM_FILE"; then
    CURRENT_SLOT="blue"
    CURRENT_CONTAINER="mmust_dcbt_server_blue"
    TARGET_SLOT="green"
    TARGET_CONTAINER="mmust_dcbt_server_green"
    TARGET_PORT=5002
else
    CURRENT_SLOT="green"
    CURRENT_CONTAINER="mmust_dcbt_server_green"
    TARGET_SLOT="blue"
    TARGET_CONTAINER="mmust_dcbt_server_blue"
    TARGET_PORT=5001
fi

echo "Currently Active Slot : $CURRENT_SLOT"
echo "Rolling Back to Slot  : $TARGET_SLOT (Port $TARGET_PORT)"

# 2. Check if the standby container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "^${TARGET_CONTAINER}$"; then
    echo "[ERROR] Standby container $TARGET_CONTAINER not found. Cannot perform container rollback."
    exit 1
fi

# 3. Start the standby container
echo "Starting standby container: $TARGET_CONTAINER..."
docker start "$TARGET_CONTAINER"

# 4. Verify its health
echo "Verifying health of $TARGET_CONTAINER on port $TARGET_PORT..."
MAX_ATTEMPTS=20
ATTEMPT=0
HEALTHY=false

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s -f "http://127.0.0.1:${TARGET_PORT}/health/ready" > /dev/null 2>&1; then
        HEALTHY=true
        break
    fi
    sleep 1
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$HEALTHY" = false ]; then
    echo "[ERROR] Rollback container failed to report healthy on port $TARGET_PORT."
    exit 1
fi

echo "Health check PASSED on port $TARGET_PORT."

# 5. Switch Upstream in Nginx
echo "server 127.0.0.1:${TARGET_PORT};" > "$UPSTREAM_FILE"

# 6. Rollback Frontend Atomic Symlink to Previous Release
RELEASES_DIR="$APP_DIR/releases"
if [ -d "$RELEASES_DIR" ]; then
    PREV_RELEASE=$(ls -1dt "$RELEASES_DIR"/* 2>/dev/null | sed -n '2p')
    if [ -n "$PREV_RELEASE" ] && [ -d "$PREV_RELEASE" ]; then
        echo "Rolling back frontend symlink to: $PREV_RELEASE"
        ln -sfn "$PREV_RELEASE" "$APP_DIR/current"
    else
        echo "No prior frontend release folder found; keeping current frontend symlink."
    fi
fi

# 7. Graceful Nginx reload
if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    echo "Nginx reloaded successfully."
fi

# 8. Stop the faulty container (KEEP it stopped, do NOT delete it)
echo "Stopping previous container $CURRENT_CONTAINER (preserved for inspection)..."
docker stop "$CURRENT_CONTAINER" || true

echo "=================================================="
echo " MMUST DCBT Rollback Completed Successfully!"
echo " Active Slot is now: $TARGET_SLOT (Port $TARGET_PORT)"
echo "=================================================="
