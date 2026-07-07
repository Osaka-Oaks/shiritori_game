# Observability — Grafana, Datadog, ELK

Health pulse, uptime monitoring, and metrics for Shiritori Game.

## Architecture

```
GitHub Actions (every 5 min)          Local / cloud
        │                                    │
        ▼                                    ▼
 scripts/health-pulse.sh ──────►  observability/docker-compose
        │                           Elasticsearch + Kibana + Logstash + Grafana
        ▼
 scripts/push-observability-metrics.sh
        ├── Datadog (metrics + synthetics)
        └── Grafana Cloud (annotations / remote write)
```

## Quick start — local ELK + Grafana

```bash
# Start stack (needs Docker)
npm run observability:up

# Run pulse + index to Elasticsearch
npm run health:pulse
ELASTICSEARCH_URL=http://localhost:9200 npm run observability:push

# Open UIs
open http://localhost:3000    # Grafana (admin / admin)
open http://localhost:5601    # Kibana
```

Import dashboard: **Shiritori — Health Pulse** (auto-provisioned from `grafana/dashboards/`).

## Health endpoint

Static pulse file deployed with the app:

`https://shiritori-game-ccaae.web.app/health.json`

Source: `shiritori-online/public/health.json` (copied to `dist/` on build).

## GitHub Actions secrets (optional)

| Secret | Purpose |
|--------|---------|
| `DATADOG_API_KEY` | Push `shiritori.uptime` + response metrics |
| `DATADOG_SITE` | Default `datadoghq.com` (use `datadoghq.eu` for EU) |
| `GRAFANA_CLOUD_API_KEY` | Grafana Cloud service account token |
| `GRAFANA_CLOUD_STACK_URL` | e.g. `https://yourstack.grafana.net` |
| `ELASTICSEARCH_URL` | Remote ES (or `http://host.docker.internal:9200` from Actions) |

Workflow: `.github/workflows/uptime.yml` runs every **5 minutes**.

## Datadog setup

1. Create API key in Datadog → Organization Settings → API Keys
2. Add `DATADOG_API_KEY` to GitHub repo secrets
3. Import monitors from `observability/datadog/monitors.json` (or create Synthetics test manually using the JSON spec)
4. Metrics received:
   - `shiritori.uptime` (0/1)
   - `shiritori.response_ms` (tags: `endpoint:homepage|health_json|js_asset`)

## Grafana Cloud setup

1. Create stack at [grafana.com](https://grafana.com)
2. Service account token → `GRAFANA_CLOUD_API_KEY`
3. Stack URL → `GRAFANA_CLOUD_STACK_URL`
4. Import `observability/grafana/dashboards/shiritori-health.json`

## CI build time

Optimizations in `.github/workflows/ci.yml`:

- Merged JSON + Prettier into one `validate-fast` job
- Path filters skip unchanged apps (incl. `shiritori_flutter`)
- Vite + TypeScript incremental caches
- Parallel security / validate / lint lanes

Local: `npm run ci:fast` for format + lint + online build only.

## Commands

```bash
npm run health:pulse              # Probe live URL → .github/health-pulse.json
npm run observability:push        # Push metrics (needs env secrets)
npm run observability:up          # docker compose up ELK + Grafana
npm run observability:down        # Stop stack
npm run test:firebase             # Full 10-point URL test
```

## Kibana index pattern

Create index pattern: `shiritori-health-pulse-*` with time field `@timestamp` or `timestamp`.
