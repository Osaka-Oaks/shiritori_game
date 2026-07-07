#!/usr/bin/env bash
# App health pulse — probes endpoints and emits JSON metrics.
# Usage: bash scripts/health-pulse.sh [url]
# Output: .github/health-pulse.json (and stdout summary)
set -euo pipefail

URL="${1:-https://shiritori-game-ccaae.web.app}"
PROJECT="${FIREBASE_PROJECT:-shiritori-game-ccaae}"
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
TS_EPOCH=$(date +%s)
OUT="${HEALTH_PULSE_OUT:-.github/health-pulse.json}"
mkdir -p "$(dirname "$OUT")"

status="up"
failures=()
homepage_ms=0
js_ms=0
health_ms=0
rtdb_code=0

probe() {
  local code time_total
  code=$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time 15 "$URL/" 2>/dev/null || echo "000")
  time_total=$(curl -fsSL -o /tmp/shiritori-body.html -w "%{time_total}" --max-time 15 "$URL/" 2>/dev/null || echo "99")
  homepage_ms=$(awk "BEGIN {printf \"%.0f\", $time_total * 1000}")

  if [ "$code" != "200" ]; then
    failures+=("homepage:http_$code")
    status="down"
  elif ! grep -q "しりとり" /tmp/shiritori-body.html 2>/dev/null; then
    failures+=("homepage:missing_content")
    status="down"
  fi

  # Health JSON (static pulse endpoint)
  local hcode htime
  hcode=$(curl -fsSL -o /tmp/shiritori-health.json -w "%{http_code}" --max-time 10 "$URL/health.json" 2>/dev/null || echo "000")
  htime=$(curl -fsSL -o /dev/null -w "%{time_total}" --max-time 10 "$URL/health.json" 2>/dev/null || echo "99")
  health_ms=$(awk "BEGIN {printf \"%.0f\", $htime * 1000}")
  if [ "$hcode" != "200" ]; then
    failures+=("health_json:http_$hcode")
    # Soft until /health.json is deployed — set STRICT_HEALTH=1 to fail on missing health.json
    [ "${STRICT_HEALTH:-0}" = "1" ] && status="down"
  fi

  # JS bundle
  local js
  js=$(grep -oE 'assets/[^"]+\.js' /tmp/shiritori-body.html 2>/dev/null | head -1 || true)
  if [ -n "$js" ]; then
    local jcode jtime
    jcode=$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time 15 "$URL/$js" 2>/dev/null || echo "000")
    jtime=$(curl -fsSL -o /dev/null -w "%{time_total}" --max-time 15 "$URL/$js" 2>/dev/null || echo "99")
    js_ms=$(awk "BEGIN {printf \"%.0f\", $jtime * 1000}")
    [ "$jcode" = "200" ] || { failures+=("js_asset:http_$jcode"); status="down"; }
  else
    failures+=("js_asset:missing")
    status="down"
  fi

  # Manifest
  local mcode
  mcode=$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time 10 "$URL/manifest.webmanifest" 2>/dev/null || echo "000")
  [ "$mcode" = "200" ] || failures+=("manifest:http_$mcode")

  # RTDB (401 = rules blocking unauth read = service is up)
  rtdb_code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 10 \
    "https://${PROJECT}-default-rtdb.firebaseio.com/.json" 2>/dev/null || echo "000")
  rtdb_code="${rtdb_code//[^0-9]/}" # sanitize
  if [ "$rtdb_code" != "401" ] && [ "$rtdb_code" != "200" ]; then
    failures+=("rtdb:http_$rtdb_code")
    status="down"
  fi

  if [ "$homepage_ms" -gt 5000 ]; then
    failures+=("homepage:slow_${homepage_ms}ms")
  fi
}

probe

# Build failures JSON array
fail_json="[]"
if [ ${#failures[@]} -gt 0 ]; then
  fail_json=$(printf '%s\n' "${failures[@]}" | jq -R . | jq -s .)
fi

cat > "$OUT" <<EOF
{
  "timestamp": "$TS",
  "epoch": $TS_EPOCH,
  "url": "$URL",
  "status": "$status",
  "healthy": $( [ "$status" = "up" ] && echo true || echo false ),
  "failures": $fail_json,
  "metrics": {
    "homepage_response_ms": $homepage_ms,
    "health_json_response_ms": $health_ms,
    "js_asset_response_ms": $js_ms,
    "rtdb_http_code": $rtdb_code,
    "uptime_gauge": $( [ "$status" = "up" ] && echo 1 || echo 0 )
  },
  "tags": {
    "service": "shiritori-online",
    "env": "${DEPLOY_ENV:-production}",
    "project": "$PROJECT"
  }
}
EOF

echo "Health pulse: $status ($URL) → $OUT"
[ "$status" = "up" ]
