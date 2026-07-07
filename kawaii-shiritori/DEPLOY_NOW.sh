#!/bin/bash
# Deploy kawaii-shiritori (feature-rich app) — non-interactive, Spark plan only.
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "🎮 Kawaii Shiritori — deploy"
echo "============================"

echo "📦 Installing dependencies..."
npm install

echo "🔍 Verifying tools..."
npx tsc --version
npx vite --version

echo "🚀 Deploying hosting + firestore rules..."
npm run deploy:hosting
npm run deploy:firestore

echo ""
echo "✅ Deploy complete!"
echo "   https://shiritori-game-ccaae.web.app"
