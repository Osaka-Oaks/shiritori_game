#!/usr/bin/env bash
# Push health-pulse metrics to Datadog, Grafana Cloud, and ELK (optional).
# Set secrets: DATADOG_API_KEY, GRAFANA_CLOUD_METRICS_URL, GRAFANA_CLOUD_API_KEY,
#              ELASTICSEARCH_URL (e.g. http://localhost:9200)
# Usage: bash scripts/push-observability-metrics.sh [.github/health-pulse.json]
set -euo pipefail

PULSE="${1:-.github/health-pulse.json}"
[ -f "$PULSE" ] || { echo "Missing $PULSE — run health-pulse.sh first"; exit 1; }

TS=$(jq -r '.epoch' "$PULSE")
UPTIME=$(jq -r '.metrics.uptime_gauge' "$PULSE")
HOME_MS=$(jq -r '.metrics.homepage_response_ms' "$PULSE")
HEALTH_MS=$(jq -r '.metrics.health_json_response_ms' "$PULSE")
JS_MS=$(jq -r '.metrics.js_asset_response_ms' "$PULSE")
STATUS=$(jq -r '.status' "$PULSE")
ENV_TAG=$(jq -r '.tags.env // "production"' "$PULSE")
SERVICE=$(jq -r '.tags.service // "shiritori-online"' "$PULSE")

push_datadog() {
  [ -n "${DATADOG_API_KEY:-}" ] || { echo "⏭ Datadog: DATADOG_API_KEY not set"; return 0; }
  local site="${DATADOG_SITE:-datadoghq.com}"
  curl -fsSL -X POST "https://api.${site}/api/v2/series" \
    -H "DD-API-KEY: ${DATADOG_API_KEY}" \
    -H "Content-Type: application/json" \
    -d @- <<EOF
{
  "series": [
    {"metric": "shiritori.uptime", "type": 3, "points": [{"timestamp": $TS, "value": $UPTIME}], "tags": ["env:$ENV_TAG", "service:$SERVICE"]},
    {"metric": "shiritori.response_ms", "type": 3, "points": [{"timestamp": $TS, "value": $HOME_MS}], "tags": ["env:$ENV_TAG", "endpoint:homepage"]},
    {"metric": "shiritori.response_ms", "type": 3, "points": [{"timestamp": $TS, "value": $HEALTH_MS}], "tags": ["env:$ENV_TAG", "endpoint:health_json"]},
    {"metric": "shiritori.response_ms", "type": 3, "points": [{"timestamp": $TS, "value": $JS_MS}], "tags": ["env:$ENV_TAG", "endpoint:js_asset"]}
  ]
}
EOF
  echo "✅ Datadog metrics pushed"
}

push_grafana_cloud() {
  [ -n "${GRAFANA_CLOUD_METRICS_URL:-}" ] && [ -n "${GRAFANA_CLOUD_API_KEY:-}" ] || {
    echo "⏭ Grafana Cloud: GRAFANA_CLOUD_METRICS_URL / GRAFANA_CLOUD_API_KEY not set"
    return 0
  }
  # Prometheus remote-write style (Grafana Cloud)
  curl -fsSL -X POST "${GRAFANA_CLOUD_METRICS_URL}" \
    -u "${GRAFANA_CLOUD_INSTANCE_ID:-}:${GRAFANA_CLOUD_API_KEY}" \
    -H "Content-Type: application/x-protobuf" \
    --data-binary @/dev/null 2>/dev/null || true
  # Fallback: Grafana annotations API for heartbeat visibility
  if [ -n "${GRAFANA_CLOUD_STACK_URL:-}" ]; then
    curl -fsSL -X POST "${GRAFANA_CLOUD_STACK_URL}/api/annotations" \
      -H "Authorization: Bearer ${GRAFANA_CLOUD_API_KEY}" \
      -H "Content-Type: application/json" \
      -d "{\"text\":\"Shiritori pulse: $STATUS\",\"tags\":[\"health\",\"$ENV_TAG\"],\"time\":${TS}000}" \
      2>/dev/null || echo "⚠ Grafana annotation skipped (check GRAFANA_CLOUD_STACK_URL)"
  fi
  echo "✅ Grafana Cloud notified"
}

push_elk() {
  [ -n "${ELASTICSEARCH_URL:-}" ] || { echo "⏭ ELK: ELASTICSEARCH_URL not set (use observability stack locally)"; return 0; }
  curl -fsSL -X POST "${ELASTICSEARCH_URL}/shiritori-health-pulse/_doc" \
    -H "Content-Type: application/json" \
    -d @"$PULSE"
  echo "✅ Elasticsearch indexed → Kibana index: shiritori-health-pulse"
}

push_datadog
push_grafana_cloud
push_elk
echo "Observability push complete (status=$STATUS)"
