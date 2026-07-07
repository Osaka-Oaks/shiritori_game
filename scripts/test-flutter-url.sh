#!/usr/bin/env bash
# Smoke-test the Flutter web deployment on Firebase Hosting.
# Usage: bash scripts/test-flutter-url.sh [url] [environment]
set -euo pipefail

URL="${1:-https://shiritori-flutter.web.app}"
ENV="${2:-production}"
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "Flutter URL test — $URL ($ENV) @ $TS"

PASSED=0
FAILED=0

check() {
  local name="$1"
  shift
  if "$@"; then
    echo "  OK  $name"
    PASSED=$((PASSED + 1))
  else
    echo "  FAIL $name"
    FAILED=$((FAILED + 1))
  fi
}

CODE=$(curl -fsSL -o /tmp/flutter-home.html -w "%{http_code}" --max-time 20 "$URL/" || echo "000")
check "homepage HTTP 200" test "$CODE" = "200"
check "flutter bootstrap script" grep -q "flutter_bootstrap.js" /tmp/flutter-home.html
check "main.dart.js reachable" curl -fsSL -o /dev/null --max-time 20 "$URL/main.dart.js"

HC=$(curl -fsSL -o /tmp/flutter-health.json -w "%{http_code}" --max-time 15 "$URL/health.json" || echo "000")
check "health.json HTTP 200" test "$HC" = "200"
check "health app id" grep -q "shiritori_flutter" /tmp/flutter-health.json

echo ""
echo "Passed: $PASSED  Failed: $FAILED"
[ "$FAILED" -eq 0 ]
