#!/usr/bin/env bash
# Post-deploy verification + deployment record (timestamp, status, URL).
# Usage: deployment-verify.sh --app <name> --url <url> --env <env> [--ci-status <ok|fail>]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP=""
URL=""
ENV="production"
CI_STATUS="ok"
SHA="${GITHUB_SHA:-local}"
BRANCH="${GITHUB_REF_NAME:-local}"
RUN_ID="${GITHUB_RUN_ID:-0}"
OUT="${DEPLOYMENT_LOG:-$ROOT/.github/deployments.jsonl}"

while [ $# -gt 0 ]; do
  case "$1" in
    --app) APP="$2"; shift 2 ;;
    --url) URL="$2"; shift 2 ;;
    --env) ENV="$2"; shift 2 ;;
    --ci-status) CI_STATUS="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

[ -n "$APP" ] && [ -n "$URL" ] || {
  echo "Usage: deployment-verify.sh --app <name> --url <url> [--env production|staging] [--ci-status ok|fail]" >&2
  exit 2
}

DEPLOYED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
SMOKE_STATUS="failed"
FULLY_DEPLOYED="false"
FAILURES=()

sleep 8

CODE=$(curl -fsSL -o /tmp/deploy-body.html -w "%{http_code}" --max-time 25 "$URL/" 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  SMOKE_STATUS="passed"
else
  FAILURES+=("homepage:http_${CODE}")
fi

if [ "$APP" = "shiritori_flutter" ]; then
  if ! bash "$ROOT/scripts/test-flutter-url.sh" "$URL" "$ENV" >/tmp/flutter-smoke.log 2>&1; then
    SMOKE_STATUS="failed"
    FAILURES+=("flutter_smoke")
    cat /tmp/flutter-smoke.log >&2 || true
  else
    SMOKE_STATUS="passed"
  fi
elif [ "$APP" = "shiritori-online" ]; then
  if ! grep -q "しりとり" /tmp/deploy-body.html 2>/dev/null; then
    SMOKE_STATUS="failed"
    FAILURES+=("content_missing")
  fi
  HCODE=$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time 15 "$URL/health.json" 2>/dev/null || echo "000")
  if [ "$HCODE" != "200" ]; then
    FAILURES+=("health_json:${HCODE}")
  fi
  JS=$(grep -oE 'assets/[^"]+\.js' /tmp/deploy-body.html 2>/dev/null | head -1 || true)
  if [ -n "$JS" ]; then
    JCODE=$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time 20 "$URL/$JS" 2>/dev/null || echo "000")
    [ "$JCODE" = "200" ] || FAILURES+=("bundle:${JCODE}")
  fi
  [ "${#FAILURES[@]}" -eq 0 ] && SMOKE_STATUS="passed"
fi

if [ "$CI_STATUS" = "ok" ] && [ "$SMOKE_STATUS" = "passed" ]; then
  FULLY_DEPLOYED="true"
fi

mkdir -p "$(dirname "$OUT")"
FAIL_JSON=$(printf '%s\n' "${FAILURES[@]:-}" | jq -R -s 'split("\n") | map(select(length>0))')
jq -nc \
  --arg deployed_at "$DEPLOYED_AT" \
  --arg app "$APP" \
  --arg url "$URL" \
  --arg environment "$ENV" \
  --arg ci_status "$CI_STATUS" \
  --arg smoke_status "$SMOKE_STATUS" \
  --arg fully_deployed "$FULLY_DEPLOYED" \
  --arg sha "$SHA" \
  --arg branch "$BRANCH" \
  --arg run_id "$RUN_ID" \
  --argjson failures "$FAIL_JSON" \
  '{
    deployed_at: $deployed_at,
    app: $app,
    url: $url,
    environment: $environment,
    ci_status: $ci_status,
    smoke_status: $smoke_status,
    fully_deployed: ($fully_deployed == "true"),
    failures: $failures,
    sha: $sha,
    branch: $branch,
    run_id: $run_id
  }' >> "$OUT"

{
  echo "## Deployment — $APP ($ENV)"
  echo ""
  echo "| Field | Value |"
  echo "|-------|-------|"
  echo "| Deployed at (UTC) | \`$DEPLOYED_AT\` |"
  echo "| URL | $URL |"
  echo "| CI status | $CI_STATUS |"
  echo "| Smoke test | $SMOKE_STATUS |"
  echo "| Fully deployed | $FULLY_DEPLOYED |"
  if [ "${#FAILURES[@]}" -gt 0 ]; then
    echo "| Failures | ${FAILURES[*]} |"
  fi
} >> "${GITHUB_STEP_SUMMARY:-/dev/null}" 2>/dev/null || true

echo "deployment-verify: app=$APP env=$ENV deployed_at=$DEPLOYED_AT fully_deployed=$FULLY_DEPLOYED smoke=$SMOKE_STATUS"

[ "$FULLY_DEPLOYED" = "true" ]
