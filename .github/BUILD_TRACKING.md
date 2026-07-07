# Build time tracking

CI and local commands to measure and trend build duration.

## Local

```bash
# Time a build and append to .github/build-history.jsonl
npm run build:track
npm run build:track:kawaii

# View recent timings + averages
npm run build:report
```

## CI (automatic)

Every `build-online` / `build-kawaii` job records:

- App name, duration (seconds), branch, SHA, run ID
- Artifact: `build-metrics-*` (30-day retention)
- **Step summary** table on the `Pipeline summary` job

Optional: set `DATADOG_API_KEY` → metric `ci.build.duration_seconds`

## Grafana

Import `monitoring/grafana/dashboards/shiritori-health.json` or query Datadog:

```
avg:ci.build.duration_seconds{app:shiritori-online}
```

## Speed optimizations applied

| Change | Effect |
|--------|--------|
| Path filters | Skip unchanged apps |
| Parallel lint / test / validate | No serial `validate-fast` gate |
| ESLint-only in lint job | `tsc` runs once in `build` |
| `node_modules` + Vite cache | Faster repeat CI builds |
| Disabled duplicate `build-optimization.yml` on push | Halves CI runs |

## Target times (cached CI)

| App | Build |
|-----|-------|
| shiritori-online | ~30–90s |
| kawaii-shiritori | ~60–180s |

Run `npm run build:track` locally to compare.
