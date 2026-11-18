#!/bin/bash
# =============================================================================
# MMUST DCBT - Domain & CSP Configuration Script
# Usage: bash scripts/configure-domains.sh <your-production-domain.com>
# Example: bash scripts/configure-domains.sh mmustcbt.ac.ke
# =============================================================================

set -e

DOMAIN="$1"

if [ -z "$DOMAIN" ]; then
  echo "Usage: bash scripts/configure-domains.sh <domain>"
  echo "Example: bash scripts/configure-domains.sh mmustcbt.ac.ke"
  exit 1
fi

echo "=========================================================="
echo " Configuring Nginx Virtual Hosts & CSP for: $DOMAIN"
echo "=========================================================="

APP_DIR="/var/www/mmust-dcbt"
if [ -d "$APP_DIR/nginx" ]; then
  cd "$APP_DIR"
fi

NGINX_DIR="nginx"
SUBDOMAINS_CONF="$NGINX_DIR/mmust-dcbt-subdomains.conf"
UNIFIED_CONF="$NGINX_DIR/mmust-dcbt-unified.conf"

if [ ! -f "$SUBDOMAINS_CONF" ] || [ ! -f "$UNIFIED_CONF" ]; then
  echo "[ERROR] Nginx configuration templates not found in '$NGINX_DIR/'."
  exit 1
fi

# Backup originals if backup doesn't exist
if [ ! -f "${SUBDOMAINS_CONF}.bak" ]; then
  cp "$SUBDOMAINS_CONF" "${SUBDOMAINS_CONF}.bak"
  cp "$UNIFIED_CONF" "${UNIFIED_CONF}.bak"
  echo ">>> Created backup templates (.bak)"
fi

# Substitute yourdomain.com with actual target domain
sed -i "s/yourdomain\.com/$DOMAIN/g" "$SUBDOMAINS_CONF"
sed -i "s/yourdomain\.com/$DOMAIN/g" "$UNIFIED_CONF"

echo "[SUCCESS] Domain updated in Nginx configuration files:"
echo "  - $UNIFIED_CONF (Unified: $DOMAIN, $DOMAIN/admin, $DOMAIN/api/v1)"

# Auto-apply to active Nginx configuration
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

if [ -d "/etc/nginx/sites-available" ]; then
  echo ">>> Updating /etc/nginx/sites-available/mmust-dcbt.conf..."
  $SUDO cp "$UNIFIED_CONF" /etc/nginx/sites-available/mmust-dcbt.conf
  $SUDO ln -sf /etc/nginx/sites-available/mmust-dcbt.conf /etc/nginx/sites-enabled/mmust-dcbt.conf
  $SUDO rm -f /etc/nginx/sites-enabled/default
fi

# Test nginx syntax if nginx binary is available
if command -v nginx >/dev/null 2>&1; then
  echo ">>> Testing Nginx syntax..."
  $SUDO nginx -t && ($SUDO systemctl reload nginx || true)
fi

echo ""
echo "=========================================================="
echo " Nginx updated for domain: $DOMAIN"
echo " Run this command now to issue your free SSL certificate:"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "=========================================================="
