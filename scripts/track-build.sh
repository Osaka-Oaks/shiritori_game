#!/usr/bin/env bash
# Time a command and record build metrics locally or in CI.
# Usage:
#   bash scripts/track-build.sh shiritori-online build
#   bash scripts/track-build.sh kawaii-shiritori test
set -euo pipefail

APP="${1:?app name (e.g. shiritori-online)}"
STEP="${2:?step (build|lint|test|type-check)}"
APP_DIR="${3:-$APP}"
HISTORY="${BUILD_HISTORY_FILE:-.github/build-history.jsonl}"
mkdir -p "$(dirname "$HISTORY")"

START_MS=$(python3 -c 'import time; print(int(time.time()*1000))' 2>/dev/null || date +%s000)
START_SEC=$SECONDS

run_step() {
  case "$STEP" in
    build)   (cd "$APP_DIR" && npm run build) ;;
    lint)    (cd "$APP_DIR" && npm run lint) ;;
    test)    (cd "$APP_DIR" && npm run test) ;;
    type-check) (cd "$APP_DIR" && npm run type-check) ;;
    *) echo "Unknown step: $STEP"; exit 1 ;;
  esac
}

if run_step; then
  STATUS="success"
  EXIT=0
else
  STATUS="failure"
  EXIT=1
fi

END_MS=$(python3 -c 'import time; print(int(time.time()*1000))' 2>/dev/null || date +%s000)
DURATION_SEC=$((SECONDS - START_SEC))
DURATION_MS=$((DURATION_SEC * 1000))

BRANCH="${GITHUB_REF_NAME:-$(git branch --show-current 2>/dev/null || echo local)}"
SHA="${GITHUB_SHA:-$(git rev-parse --short HEAD 2>/dev/null || echo local)}"
RUN_ID="${GITHUB_RUN_ID:-local}"

RECORD=$(jq -nc \
  --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg app "$APP" \
  --arg step "$STEP" \
  --arg status "$STATUS" \
  --argjson duration_ms "$DURATION_MS" \
  --argjson duration_s "$DURATION_SEC" \
  --arg branch "$BRANCH" \
  --arg sha "$SHA" \
  --arg run_id "$RUN_ID" \
  --arg runner "${RUNNER_OS:-local}" \
  '{timestamp:$ts,app:$app,step:$step,status:$status,duration_ms:$duration_ms,duration_s:$duration_s,branch:$branch,sha:$sha,run_id:$run_id,runner:$runner}')

echo "$RECORD" >> "$HISTORY"
echo "$RECORD" | tee "${GITHUB_OUTPUT:-/dev/null}" 2>/dev/null || echo "$RECORD"

# Optional Datadog push
if [ -n "${DATADOG_API_KEY:-}" ]; then
  SITE="${DATADOG_SITE:-datadoghq.com}"
  TS=$(date +%s)
  curl -fsSL -X POST "https://api.${SITE}/api/v2/series" \
    -H "DD-API-KEY: ${DATADOG_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"series\":[{\"metric\":\"ci.build.duration_seconds\",\"type\":3,\"points\":[{\"timestamp\":${TS},\"value\":${DURATION_SEC}}],\"tags\":[\"app:${APP}\",\"step:${STEP}\",\"status:${STATUS}\",\"branch:${BRANCH}\"]}]}" \
    >/dev/null 2>&1 && echo "📊 Datadog: ci.build.duration_seconds=${DURATION_SEC}s" || true
fi

echo "⏱  ${APP}/${STEP}: ${DURATION_SEC}s (${STATUS})"
exit $EXIT
