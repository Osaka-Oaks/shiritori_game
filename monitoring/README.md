# Monitoring — app health & pulse

Self-hosted **Prometheus + Grafana + Blackbox exporter** that synthetically probes
the live Shiritori app for **uptime, latency, and SSL expiry**. This is the right
shape for a _static_ site (Firebase Hosting): there's no server to run an agent on,
so we probe from outside instead.

## Run it

```bash
cd monitoring
docker compose up -d
```

| Service    | URL                   | Notes                                                                              |
| ---------- | --------------------- | ---------------------------------------------------------------------------------- |
| Grafana    | http://localhost:3001 | login `admin` / `admin`; dashboard **"Shiritori — App Health & Pulse"** auto-loads |
| Prometheus | http://localhost:9090 | raw metrics + targets                                                              |
| Blackbox   | http://localhost:9115 | probe engine                                                                       |

Stop: `docker compose down` (add `-v` to wipe stored history).

## What it watches

- **Homepage** `https://shiritori-game-ccaae.web.app/` — expects HTTP 200
- **RTDB** — expects 200/401 (401 = reachable _and_ secured by rules)
- Metrics: `probe_success`, `probe_duration_seconds`, `probe_ssl_earliest_cert_expiry`

Add more endpoints by editing [`prometheus/prometheus.yml`](prometheus/prometheus.yml).

## Alerting

Grafana → Alerting → create a rule on `probe_success == 0` and wire a contact point
(email/Slack/webhook). This complements the GitHub-native
[`../.github/workflows/uptime.yml`](../.github/workflows/uptime.yml) cron, which already
opens an incident issue when the site is down — so you have alerting even without
running this stack.

## About Grafana Cloud / Datadog / ELK

- **Grafana Cloud** (free tier): point this same Prometheus at it, or use its
  Synthetic Monitoring to run the probes for you — no local Docker needed.
- **Datadog**: paid SaaS. Fits if you later add a backend or want RUM; needs an
  account + `DD_API_KEY`. Its browser RUM SDK can be dropped into the web app for
  real-user metrics — bring a key and it's a small change.
- **ELK (Elasticsearch/Logstash/Kibana)**: built for **server logs**. A static SPA
  produces none, so it would sit empty unless you ship client logs or Firebase
  logs into it. Heavy (Elasticsearch wants ~2 GB RAM). Not recommended for this app
  until there's a backend generating logs.

## Reducing build time (already applied)

- App bundle split into `app / react / firebase` chunks (Vite `manualChunks`).
- CI path filters skip unchanged apps; lint/test/validate run **in parallel**.
- ESLint-only in lint job; `tsc` runs once in `build`.
- `node_modules` + Vite caches on CI builds.
- Build times logged to `.github/build-history.jsonl` — see [BUILD_TRACKING.md](../.github/BUILD_TRACKING.md).
- Duplicate `build-optimization.yml` disabled on push (manual benchmark only).
