#!/bin/bash

# 🔧 Fix Dependencies and Deploy Script
# Fixes React 19 dependency conflicts and deploys to Firebase

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔧 Fixing Dependencies and Deploying"
echo "===================================="
echo ""

# Step 1: Clean everything
echo -e "${BLUE}1️⃣  Cleaning old dependencies...${NC}"
rm -rf node_modules
rm -f package-lock.json
echo -e "${GREEN}✅ Cleaned${NC}"
echo ""

# Step 2: Install with legacy peer deps (fixes React 19 conflict)
echo -e "${BLUE}2️⃣  Installing dependencies (with --legacy-peer-deps)...${NC}"
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${RED}❌ Installation failed${NC}"
  exit 1
fi
echo ""

# Step 3: Verify TypeScript is available
echo -e "${BLUE}3️⃣  Verifying TypeScript...${NC}"
npx tsc --version
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ TypeScript available${NC}"
else
  echo -e "${YELLOW}⚠️  TypeScript check failed but continuing...${NC}"
fi
echo ""

# Step 4: Build the project
echo -e "${BLUE}4️⃣  Building project...${NC}"
npm run build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi
echo ""

# Step 5: Deploy to Firebase
echo -e "${BLUE}5️⃣  Deploying to Firebase...${NC}"
firebase deploy
if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}🎉 Deployment Successful!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "🌐 Your site is live at:"
  echo "   https://shiritori-game-ccaae.web.app"
  echo ""
  echo "📊 Firebase Console:"
  echo "   https://console.firebase.google.com/project/shiritori-game-ccaae"
  echo ""
else
  echo ""
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ Deployment Failed${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 1
fi
