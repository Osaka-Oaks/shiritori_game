# GitHub repository secrets & variables

Use this checklist when configuring **Settings → Secrets and variables → Actions** for the `shiritori_game` repo.

> **Never commit** `.env`, `FIREBASE_TOKEN`, `GEMINI_API_KEY`, or service-account JSON files.

---

## Required for CI/CD deploy (main pipeline)

| Name             | Type       | Used in                                                          | How to get                                   |
| ---------------- | ---------- | ---------------------------------------------------------------- | -------------------------------------------- |
| `FIREBASE_TOKEN` | **Secret** | `.github/workflows/ci.yml`, `deploy-*.yml`, `deploy-flutter.yml` | Run `firebase login:ci` locally; paste token |

Without `FIREBASE_TOKEN`, builds still run but **deploy jobs fail**.

---

## Required for Vite app builds (after env-only Firebase config)

Add these as **Secrets** or **Repository variables** (variables are fine — client Firebase keys are public by design; rules enforce access).

| Name                                  | Apps                       | Used in              |
| ------------------------------------- | -------------------------- | -------------------- |
| `VITE_FIREBASE_API_KEY`               | online, kawaii, word-chain | `ci.yml` build jobs  |
| `VITE_FIREBASE_AUTH_DOMAIN`           | all Vite apps              | `ci.yml` build jobs  |
| `VITE_FIREBASE_DATABASE_URL`          | online, kawaii             | `ci.yml` build jobs  |
| `VITE_FIREBASE_PROJECT_ID`            | all                        | `ci.yml` build jobs  |
| `VITE_FIREBASE_STORAGE_BUCKET`        | all                        | `ci.yml` build jobs  |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`   | all                        | `ci.yml` build jobs  |
| `VITE_FIREBASE_APP_ID`                | all                        | `ci.yml` build jobs  |
| `VITE_FIREBASE_MEASUREMENT_ID`        | optional                   | Analytics            |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | kawaii, word-chain         | Default: `(default)` |

**Where to copy values:** [Firebase Console](https://console.firebase.google.com/) → `shiritori-game-ccaae` → Project settings → Your apps → Web app config.

---

## Optional — observability workflows

| Name                        | Type            | Workflow                                         |
| --------------------------- | --------------- | ------------------------------------------------ |
| `DATADOG_API_KEY`           | Secret          | `ci.yml`, `uptime.yml`, `build-optimization.yml` |
| `DATADOG_SITE`              | Secret/variable | e.g. `datadoghq.com`                             |
| `GRAFANA_CLOUD_API_KEY`     | Secret          | `uptime.yml`                                     |
| `GRAFANA_CLOUD_STACK_URL`   | Secret          | `uptime.yml`                                     |
| `GRAFANA_CLOUD_METRICS_URL` | Secret          | `scripts/push-observability-metrics.sh`          |
| `GRAFANA_CLOUD_INSTANCE_ID` | Secret          | metrics push script                              |
| `ELASTICSEARCH_URL`         | Secret          | `uptime.yml`                                     |

All optional — workflows skip push when unset.

---

## Optional — other workflows

| Name                       | Type          | Used in                                             |
| -------------------------- | ------------- | --------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT` | Secret (JSON) | `kawaii-shiritori/.github/workflows/deploy.yml`     |
| `FIREBASE_PROJECT_ID`      | Variable      | kawaii deploy workflow                              |
| `ADD_TO_PROJECT_PAT`       | Secret        | `.github/workflows/labels.yml`                      |
| `GITHUB_TOKEN`             | Auto-provided | Gitleaks, scheduled tasks — **do not add manually** |

---

## Local development only (`.env` files — not GitHub)

| Variable           | App                                    | Notes                      |
| ------------------ | -------------------------------------- | -------------------------- |
| `GEMINI_API_KEY`   | kawaii-shiritori, shiritori-word-chain | Server-side AI routes only |
| `OLLAMA_URL`       | kawaii-shiritori                       | Local free AI              |
| `OLLAMA_MODEL`     | kawaii-shiritori                       | e.g. `qwen3`               |
| `VITE_AI_PROVIDER` | kawaii-shiritori                       | `gemini` or `ollama`       |
| `APP_URL`          | kawaii, word-chain                     | Dev server URL             |

Copy `.env.example` → `.env` in each app folder (or use repo root `.env.example` as reference).

```bash
cp shiritori-online/.env.example shiritori-online/.env
cp kawaii-shiritori/.env.example kawaii-shiritori/.env
# Fill in values from Firebase Console
```

Generate service-worker config after setting `.env`:

```bash
node scripts/generate-firebase-public-config.mjs shiritori-online
node scripts/generate-firebase-public-config.mjs kawaii-shiritori
```

---

## Flutter (`shiritori_flutter`)

| Item                                                | Notes                                                                         |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| `lib/firebase_options.dart`                         | Generated by `flutterfire configure` — **client config**, not a deploy secret |
| `google-services.json` / `GoogleService-Info.plist` | Mobile client config — committed by FlutterFire convention                    |
| CI deploy                                           | Uses `FIREBASE_TOKEN` only                                                    |

---

## Quick setup commands

```bash
# 1. Local Firebase deploy token (add output to GitHub secret FIREBASE_TOKEN)
firebase login:ci

# 2. GitHub CLI — set required secret (example)
gh secret set FIREBASE_TOKEN

# 3. Set Vite Firebase vars (repeat for each, or use GitHub UI)
gh secret set VITE_FIREBASE_API_KEY
gh secret set VITE_FIREBASE_AUTH_DOMAIN
gh secret set VITE_FIREBASE_PROJECT_ID
gh secret set VITE_FIREBASE_STORAGE_BUCKET
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID
gh secret set VITE_FIREBASE_APP_ID
gh secret set VITE_FIREBASE_DATABASE_URL
```

---

## Audit status (what is NOT a secret)

| Location                                      | Status                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `shiritori-online/src/firebase.ts`            | ✅ Env-only (no hardcoded keys)                                             |
| `kawaii-shiritori/src/lib/firebase.ts`        | ✅ Env-only                                                                 |
| `shiritori-word-chain/src/firebase.ts`        | ✅ Env-only (removed wrong AI Studio project JSON)                          |
| `firebase-messaging-sw.js`                    | ✅ Loads `/firebase-config.json` at runtime                                 |
| `shiritori_flutter/lib/firebase_options.dart` | ⚠️ Client config by FlutterFire design — restrict via Firebase rules        |
| `monitoring/docker-compose.yml`               | ⚠️ `GF_SECURITY_ADMIN_PASSWORD: admin` — **local dev only**, not production |

See also [SECURITY.md](SECURITY.md) for disclosure policy.
