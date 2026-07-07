# Branching & deployment

## Branch model

| Branch | Purpose | CI | Deploy target |
|--------|---------|-----|---------------|
| `main` | Production-ready | Full pipeline + security | **Production** — https://shiritori-game-ccaae.web.app |
| `develop` | Integration / staging | Full pipeline + security | **Preview channel** `develop` (14-day URL) |
| `feature/*` | New features | Validate only (format, lint, test, build) | None |
| `fix/*` | Bug fixes | Same as `feature/*` | None |

## Path-based deployment

Deploy steps run only when relevant paths change:

| Paths | Deploy action |
|-------|----------------|
| `shiritori-online/**` | Hosting + Realtime Database rules |
| `kawaii-shiritori/firestore.rules`, `firestore.indexes.json` | Firestore rules |
| `.github/workflows/ci.yml` | Full redeploy (CI config changed) |

Unrelated changes (e.g. docs only) skip Firebase deploy on `main`.

## Workflow

1. Branch from `develop`: `git checkout -b feature/my-feature develop`
2. Open PR into `develop` — CI runs security + tests
3. Merge to `develop` — preview channel deploy + smoke test
4. Open PR `develop` → `main` when ready for production
5. Merge to `main` — production deploy

## Manual deploy

Actions → **Deploy (manual)** → optional kawaii hosting (replaces live site).

## Required secret

`FIREBASE_TOKEN` — generate with `firebase login:ci`
