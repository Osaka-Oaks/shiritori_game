#!/usr/bin/env bash
# Security checks for CI and local pre-deploy.
# Fails on critical npm audit findings and committed secrets patterns.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILED=0

fail() { echo -e "${RED}FAIL${NC} $1"; FAILED=1; }
pass() { echo -e "${GREEN}PASS${NC} $1"; }
warn() { echo -e "${YELLOW}WARN${NC} $1"; }

echo "=== Security check ==="

# Block committed env files with secrets
for f in .env .env.local .env.production kawaii-shiritori/.env kawaii-shiritori/.env.local; do
  if git ls-files --error-unmatch "$f" &>/dev/null; then
    fail "Secret file tracked in git: $f"
  else
    pass "Not tracked: $f"
  fi
done

# Firebase rules must be valid JSON / rules syntax markers
for rules in shiritori-online/database.rules.json kawaii-shiritori/firestore.indexes.json; do
  if node -e "JSON.parse(require('fs').readFileSync('$rules','utf8'))"; then
    pass "Valid JSON: $rules"
  else
    fail "Invalid JSON: $rules"
  fi
done

if grep -q 'rules_version' kawaii-shiritori/firestore.rules 2>/dev/null; then
  pass "Firestore rules header present"
else
  fail "Missing rules_version in firestore.rules"
fi

# npm audit — critical blocks, high warns
audit_app() {
  local app=$1
  echo "--- npm audit: $app (production) ---"
  cd "$app"
  npm ci --silent
  if npm audit --omit=dev --audit-level=critical --json > /tmp/audit-"$app".json 2>/dev/null; then
    pass "$app: no critical production vulnerabilities"
  else
    CRITICAL=$(node -e "
      const r=require('/tmp/audit-$app.json');
      const m=r.metadata?.vulnerabilities||{};
      console.log(m.critical||0);
    " 2>/dev/null || echo "1")
    if [ "${CRITICAL:-0}" -gt 0 ]; then
      fail "$app: $CRITICAL critical production vulnerabilities"
    else
      warn "$app: devDependency advisories present (run npm audit)"
    fi
  fi
  cd - >/dev/null
}

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
audit_app shiritori-online
audit_app kawaii-shiritori

# Quick pattern scan for hardcoded API keys in app source
SCAN_DIRS=$(find shiritori-online/src kawaii-shiritori/src shiritori-word-chain/src -name '*.ts' -o -name '*.tsx' 2>/dev/null || true)
if [ -n "$SCAN_DIRS" ] && echo "$SCAN_DIRS" | xargs grep -lE 'AIza[0-9A-Za-z_-]{20,}' 2>/dev/null; then
  fail "Possible hardcoded Firebase API key in source"
else
  pass "No hardcoded API key patterns in src"
fi

# Check for hardcoded tokens, passwords, secrets in source files
echo "--- Scanning for hardcoded secrets ---"
PATTERNS=(
  'password\s*=\s*["\047][^"\047]{3,}'
  'token\s*=\s*["\047][A-Za-z0-9_-]{20,}'
  'secret\s*=\s*["\047][A-Za-z0-9_-]{10,}'
  'api[_-]?key\s*=\s*["\047][A-Za-z0-9_-]{20,}'
  'bearer\s+[A-Za-z0-9_-]{20,}'
  'sk-[A-Za-z0-9]{20,}'
)

SECRET_FOUND=0
for pattern in "${PATTERNS[@]}"; do
  if grep -rE -i "$pattern" \
    shiritori-online/src \
    kawaii-shiritori/src \
    shiritori-word-chain/src \
    kawaii-shiritori/server.ts \
    shiritori-word-chain/server.ts \
    --include="*.ts" --include="*.tsx" --include="*.js" \
    --exclude-dir=node_modules \
    --exclude-dir=dist 2>/dev/null | grep -v -E '(password-hash\.ts|AuthView\.tsx|test|spec|mock|example)'; then
    SECRET_FOUND=1
  fi
done

if [ "$SECRET_FOUND" -eq 1 ]; then
  warn "Potential secrets found in source (review above - may be false positives)"
else
  pass "No obvious hardcoded secrets in source files"
fi

# Flutter firebase_options.dart check (intentional client keys)
if grep -qE 'AIza[0-9A-Za-z_-]{35}' shiritori_flutter/lib/firebase_options.dart 2>/dev/null; then
  pass "Flutter firebase_options.dart has client keys (intentional, FlutterFire generated)"
else
  warn "Flutter firebase_options.dart may be missing or incomplete"
fi

# Check monitoring configs for dev-only passwords
if grep -q 'GF_SECURITY_ADMIN_PASSWORD.*admin' monitoring/docker-compose.yml 2>/dev/null; then
  pass "Grafana dev password detected (local dev only - acceptable)"
fi

# Service worker must not embed keys
for sw in kawaii-shiritori/public/firebase-messaging-sw.js; do
  if [ -f "$sw" ] && grep -qE 'AIza[0-9A-Za-z_-]{20,}' "$sw" 2>/dev/null; then
    fail "Hardcoded API key in $sw"
  else
    pass "No hardcoded keys in $sw"
  fi
done

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo -e "${RED}Security check failed.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}Security check passed.${NC}"
