#!/usr/bin/env bash
# =============================================================================
# MMUST DCBT - Reset Local Database & Create Fresh Admin User
# Usage: bash scripts/reset_local_db.sh
# =============================================================================

set -e

APP_DIR="/var/www/mmust-dcbt"
LOCAL_CONTAINER="mmust_dcbt_db"
DB_NAME="mmust_dcbt"
ADMIN_EMAIL="shotgunmuemah@gmail.com"
ADMIN_PASS='@Muemah7098'
ADMIN_NAME="System Administrator"

echo "=========================================================="
echo " MMUST DCBT - Fresh Local Database Initialization"
echo "=========================================================="

if ! docker ps --format '{{.Names}}' | grep -q "^${LOCAL_CONTAINER}$"; then
  echo "[ERROR] Local database container '${LOCAL_CONTAINER}' is not running."
  exit 1
fi

echo ">>> Wiping existing tables in '$DB_NAME' to start completely fresh..."
docker exec -i "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME" << 'EOF'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
EOF

echo ">>> Applying clean schema (all 12 production tables)..."
SCHEMA_FILE="$APP_DIR/server/sql/00_init_schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
  SCHEMA_FILE="server/sql/00_init_schema.sql"
fi

docker exec -i "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME" < "$SCHEMA_FILE" > /dev/null 2>&1

echo ">>> Tables created successfully!"

ACTIVE_SERVER=$(docker ps --filter "name=mmust_dcbt_server_" --format "{{.Names}}" | head -n 1)

if [ -n "$ACTIVE_SERVER" ]; then
  echo ">>> Creating Admin user ($ADMIN_EMAIL) inside $ACTIVE_SERVER..."
  docker exec -i "$ACTIVE_SERVER" node scripts/create-admin.js "$ADMIN_EMAIL" "$ADMIN_PASS" "$ADMIN_NAME"
else
  echo "[ERROR] No active server container found."
  exit 1
fi

echo ""
echo "=========================================================="
echo " Admin User Verification:"
docker exec -i "$LOCAL_CONTAINER" psql -U postgres -d "$DB_NAME" -c \
  "SELECT id, name, email, role, created_at FROM users WHERE email = '$ADMIN_EMAIL';"
echo "=========================================================="
echo " Setup complete! Log in at: http://YOUR_VPS_IP/admin"
echo " Email   : $ADMIN_EMAIL"
echo " Password: $ADMIN_PASS"
echo "=========================================================="
