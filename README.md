# Shiritori Game · しりとり

A real-time, two-player **Shiritori** (Japanese word-chain) game you can play
across two phones or computers. Bilingual (English / 日本語) UI, light/dark theme,
installable as a PWA.

**▶ Play live:** https://shiritori-game-ccaae.web.app

[![CI/CD](https://github.com/JorelFuji/shiritori_game/actions/workflows/deploy.yml/badge.svg)](https://github.com/JorelFuji/shiritori_game/actions/workflows/deploy.yml)

---

## What's in this repo

| Folder | What it is |
|---|---|
| **`shiritori-online/`** | ✅ The finished, deployed game — React 18 + TypeScript + Vite, Firebase Realtime Database. **This is the one that's live.** |
| `kawaii-shiritori/` | Earlier prototype (kept for reference) |
| `shiritori-word-chain/` | Earlier prototype (kept for reference) |
| `shiritori-v1/` | Early Next.js scaffold (kept for reference) |
| `stitch_bilingual_shiritori_blitz/` | Design mockups (static HTML screens) |
| `How to Play Shiritori.*` | The bilingual rules guide |

The working game lives in **[`shiritori-online/`](shiritori-online/)** — see its
[README](shiritori-online/README.md) for full details.

---

## Run it locally

```bash
cd shiritori-online
npm install
npm run dev          # open the printed Network URL on your phone to test
```

---

## CI/CD (GitHub Actions → Firebase)

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

- **Every push & pull request** → installs deps, type-checks, and builds
  `shiritori-online`. A broken build fails the check.
- **Push to `main`** (after the build passes) → automatically deploys the game to
  Firebase Hosting + Database rules. No manual `npm run deploy` needed.

### One-time setup — the `FIREBASE_TOKEN` secret

The deploy step authenticates with a Firebase CI token stored as a GitHub secret.

1. Generate a token locally:
   ```bash
   firebase login:ci
   ```
   Sign in via the browser; copy the printed token.
2. Add it at **Repo → Settings → Secrets and variables → Actions → New repository
   secret**:
   - Name: `FIREBASE_TOKEN`
   - Value: *(the token)*

That's it. From then on:

```
edit code  →  git push  →  Actions builds + auto-deploys  →  shiritori-game-ccaae.web.app
```

Watch runs in the [**Actions** tab](https://github.com/JorelFuji/shiritori_game/actions).

> To deploy manually instead, run `npm run deploy` inside `shiritori-online/`
> (requires `firebase login`).
