#!/bin/bash
# Deploy Shiritori from repo root — installs deps first, then deploys.
# Usage:
#   ./DEPLOY.sh              # hosting + RTDB rules (two-player app)
#   ./DEPLOY.sh hosting      # hosting only
#   ./DEPLOY.sh database     # realtime database rules only
#   ./DEPLOY.sh firestore    # firestore rules (kawaii-shiritori leaderboard)
#   ./DEPLOY.sh kawaii       # full kawaii-shiritori deploy

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

TARGET="${1:-all}"

echo "🎮 Shiritori deploy ($TARGET)"
echo "=============================="

case "$TARGET" in
  hosting)
    npm run deploy:hosting
    ;;
  database)
    npm run deploy:database
    ;;
  firestore)
    npm run deploy:firestore
    ;;
  kawaii)
    npm run deploy:kawaii
    ;;
  kawaii-hosting)
    npm run deploy:kawaii:hosting
    ;;
  all|*)
    npm run deploy
    ;;
esac

echo ""
echo "✅ Done!"
echo "   Live URL: https://shiritori-game-ccaae.web.app"
echo ""
echo "Spark plan deploy targets:"
echo "   ./DEPLOY.sh hosting   — UI only"
echo "   ./DEPLOY.sh database  — RTDB security rules (2-player)"
echo "   ./DEPLOY.sh firestore — Firestore rules (leaderboard)"
