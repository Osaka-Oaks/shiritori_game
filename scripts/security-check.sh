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
