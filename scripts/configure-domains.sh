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
echo "  - $SUBDOMAINS_CONF (Subdomains: $DOMAIN, admin.$DOMAIN, api.$DOMAIN)"
echo "  - $UNIFIED_CONF (Unified: $DOMAIN, $DOMAIN/admin, $DOMAIN/api/v1)"
echo ""
echo "CSP directives updated to permit: https://api.$DOMAIN and wss:"

# Test nginx syntax if nginx binary is available
if command -v nginx >/dev/null 2>&1; then
  echo ">>> Testing Nginx syntax..."
  nginx -t || true
fi

echo ""
echo "Next Steps:"
echo "1. If using subdomains, link configuration:"
echo "   sudo ln -sf $(pwd)/$SUBDOMAINS_CONF /etc/nginx/sites-available/mmust-dcbt.conf"
echo "   sudo ln -sf /etc/nginx/sites-available/mmust-dcbt.conf /etc/nginx/sites-enabled/"
echo "2. Obtain SSL certificates via Certbot:"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -d admin.$DOMAIN -d api.$DOMAIN"
echo "3. Reload Nginx:"
echo "   sudo systemctl reload nginx"
echo "=========================================================="
