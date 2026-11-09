#!/bin/bash
# =============================================================================
# MMUST DCBT - Preflight Environment & Secrets Validation
# Usage: bash scripts/preflight-check.sh [path-to-.env]
# =============================================================================

set -e

ENV_FILE="${1:-.env}"

echo "=========================================================="
echo " MMUST DCBT Production Preflight Security & Secrets Check"
echo " Target Environment File: $ENV_FILE"
echo "=========================================================="

if [ ! -f "$ENV_FILE" ]; then
  echo "[CRITICAL FAIL] Environment file '$ENV_FILE' not found!"
  echo "Please copy .env.example to .env and configure real credentials."
  exit 1
fi

# Safely parse environment variables without eval to avoid shell redirection syntax errors (< or >)
get_env_val() {
  local target_key="$1"
  grep -E "^${target_key}=" "$ENV_FILE" 2>/dev/null | head -n 1 | cut -d'=' -f2- | tr -d '"' | tr -d "'"
}

PREFLIGHT_NODE_ENV=$(get_env_val "NODE_ENV")
PREFLIGHT_JWT_SECRET=$(get_env_val "JWT_SECRET")
PREFLIGHT_POSTGRES_PASSWORD=$(get_env_val "POSTGRES_PASSWORD")
PREFLIGHT_DATABASE_URL=$(get_env_val "DATABASE_URL")
PREFLIGHT_DB_SSL_ALLOW_SELFSIGNED=$(get_env_val "DB_SSL_ALLOW_SELFSIGNED")
PREFLIGHT_DB_SSL_REJECT_UNAUTHORIZED=$(get_env_val "DB_SSL_REJECT_UNAUTHORIZED")
PREFLIGHT_GEMINI_API_KEY=$(get_env_val "GEMINI_API_KEY")
PREFLIGHT_ALLOWED_ORIGINS=$(get_env_val "ALLOWED_ORIGINS")

FAILURES=0
WARNINGS=0

check_fail() {
  echo "  [FAIL] $1"
  FAILURES=$((FAILURES + 1))
}

check_warn() {
  echo "  [WARN] $1"
  WARNINGS=$((WARNINGS + 1))
}

check_pass() {
  echo "  [PASS] $1"
}

# 1. Environment mode
echo ""
echo "--- 1. Node Environment Check ---"
if [ "$PREFLIGHT_NODE_ENV" = "production" ]; then
  check_pass "NODE_ENV is set to 'production'"
else
  check_fail "NODE_ENV is '$PREFLIGHT_NODE_ENV' (must be 'production' for live release)"
fi

# 2. JWT Secret Validation
echo ""
echo "--- 2. JWT Secret Strength Check ---"
if [ -z "$PREFLIGHT_JWT_SECRET" ]; then
  check_fail "JWT_SECRET is missing or empty"
elif [[ "$PREFLIGHT_JWT_SECRET" == *"<GENERATE_"* ]] || [[ "$PREFLIGHT_JWT_SECRET" == *"your_jwt_secret"* ]]; then
  check_fail "JWT_SECRET contains an unreplaced placeholder string"
elif [ ${#PREFLIGHT_JWT_SECRET} -lt 32 ]; then
  check_fail "JWT_SECRET is only ${#PREFLIGHT_JWT_SECRET} characters (minimum required is 32)"
else
  check_pass "JWT_SECRET is strong (${#PREFLIGHT_JWT_SECRET} characters)"
fi

# 3. Database Password & Connection Check
echo ""
echo "--- 3. Database Password Strength Check ---"
DB_PASS="$PREFLIGHT_POSTGRES_PASSWORD"

# If POSTGRES_PASSWORD is empty, parse from DATABASE_URL
if [ -z "$DB_PASS" ] && [ -n "$PREFLIGHT_DATABASE_URL" ]; then
  DB_PASS=$(echo "$PREFLIGHT_DATABASE_URL" | sed -E 's#^.*://[^:]+:([^@]+)@.*$#\1#')
fi

WEAK_PASSWORDS="postgres password admin 123456 12345678 mmust mmust_dcbt secret"

if [ -z "$DB_PASS" ]; then
  check_fail "Database password could not be found in POSTGRES_PASSWORD or DATABASE_URL"
elif [[ "$DB_PASS" == *"<GENERATE_"* ]]; then
  check_fail "Database password contains an unreplaced '<GENERATE_...>' placeholder"
elif [ ${#DB_PASS} -lt 16 ]; then
  check_fail "Database password is too short (${#DB_PASS} chars). Must be at least 16 characters in production."
else
  IS_WEAK=false
  for weak in $WEAK_PASSWORDS; do
    if [ "$DB_PASS" = "$weak" ]; then
      IS_WEAK=true
      break
    fi
  done
  if [ "$IS_WEAK" = true ]; then
    check_fail "Database password is a known default or dictionary word ('$DB_PASS')"
  else
    check_pass "Database password meets complexity and length requirements (${#DB_PASS} characters)"
  fi
fi

# 4. Database TLS Certificate Verification
echo ""
echo "--- 4. Database TLS Verification Check ---"
if [ "$PREFLIGHT_DB_SSL_ALLOW_SELFSIGNED" = "true" ] || [ "$PREFLIGHT_DB_SSL_REJECT_UNAUTHORIZED" = "false" ]; then
  check_fail "Insecure TLS override enabled (DB_SSL_ALLOW_SELFSIGNED or DB_SSL_REJECT_UNAUTHORIZED=false). Prohibited in production."
else
  check_pass "Strict TLS certificate verification enforced (no unverified TLS overrides)"
fi

# 5. Gemini AI API Key Check
echo ""
echo "--- 5. AI API Key Check ---"
if [ -z "$PREFLIGHT_GEMINI_API_KEY" ]; then
  check_fail "GEMINI_API_KEY is missing or empty"
elif [[ "$PREFLIGHT_GEMINI_API_KEY" == *"<GENERATE_"* ]]; then
  check_fail "GEMINI_API_KEY contains an unreplaced placeholder string"
else
  check_pass "GEMINI_API_KEY is configured"
fi

# 6. File Permissions Check
echo ""
echo "--- 6. Secrets File Permissions Check ---"
PERMS=$(stat -c "%a" "$ENV_FILE" 2>/dev/null || stat -f "%Lp" "$ENV_FILE" 2>/dev/null || echo "unknown")
if [ "$PERMS" != "600" ] && [ "$PERMS" != "400" ]; then
  # Auto-remediate permissions to 600
  chmod 600 "$ENV_FILE" 2>/dev/null || true
  PERMS=$(stat -c "%a" "$ENV_FILE" 2>/dev/null || stat -f "%Lp" "$ENV_FILE" 2>/dev/null || echo "unknown")
fi

if [ "$PERMS" = "600" ] || [ "$PERMS" = "400" ]; then
  check_pass "$ENV_FILE permissions are strictly restricted ($PERMS)"
else
  check_fail "$ENV_FILE permissions are insecure ($PERMS). Run: chmod 600 $ENV_FILE"
fi

# 7. Nginx & Domain Configuration Check
echo ""
echo "--- 7. Nginx & Domain Configuration Check ---"
if [[ "$PREFLIGHT_ALLOWED_ORIGINS" == *"yourdomain.com"* ]]; then
  check_fail "ALLOWED_ORIGINS in '$ENV_FILE' contains placeholder 'yourdomain.com'. Set to your production domain (e.g. https://mmustcbt.ac.ke)."
elif [ -n "$PREFLIGHT_ALLOWED_ORIGINS" ]; then
  check_pass "ALLOWED_ORIGINS is configured ($PREFLIGHT_ALLOWED_ORIGINS)"
fi

if [ -d "nginx" ] && grep -rn --exclude="*.bak" --exclude="*.md" "yourdomain.com" nginx/ >/dev/null 2>&1; then
  check_fail "Nginx config files contain unreplaced placeholder 'yourdomain.com'. Run 'bash scripts/configure-domains.sh <domain>' before production release."
elif [ -d "nginx" ]; then
  check_pass "No placeholder 'yourdomain.com' found in active nginx/ configs"
fi

echo ""
echo "=========================================================="
if [ $FAILURES -gt 0 ]; then
  echo " [PREFLIGHT FAILED] Found $FAILURES blocker(s) and $WARNINGS warning(s)."
  echo " Please fix the blockers above before deploying to production!"
  echo "=========================================================="
  exit 1
else
  echo " [PREFLIGHT PASSED] All production security & secret checks verified."
  if [ $WARNINGS -gt 0 ]; then
    echo " ($WARNINGS non-blocking warning(s) detected - see recommendations above)"
  fi
  echo "=========================================================="
  exit 0
fi
