#!/bin/bash

# 🔄 Safe Dependency Update Script
# Updates packages with testing at each step

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔄 Safe Dependency Update"
echo "========================="
echo ""

# Backup current state
echo -e "${BLUE}📋 Creating backup...${NC}"
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup 2>/dev/null || true
echo -e "${GREEN}✅ Backup created${NC}"
echo ""

# Choose update type
echo -e "${BLUE}📦 Update type:${NC}"
echo "  1) Patch updates only (safest - bug fixes)"
echo "  2) Minor updates (safe - new features)"
echo "  3) Major updates (careful - breaking changes)"
echo "  4) Security fixes only"
echo ""
read -p "Enter choice (1-4, default: 1): " update_choice
update_choice=${update_choice:-1}
echo ""

case $update_choice in
  1)
    echo -e "${BLUE}🔧 Updating patch versions...${NC}"
    npm update --legacy-peer-deps
    ;;
  2)
    echo -e "${BLUE}🔧 Updating minor versions...${NC}"
    if command -v ncu &> /dev/null; then
      ncu -u --target minor
      npm install --legacy-peer-deps
    else
      echo -e "${RED}❌ npm-check-updates not installed${NC}"
      echo "Install: npm install -g npm-check-updates"
      exit 1
    fi
    ;;
  3)
    echo -e "${YELLOW}⚠️  Major updates can break things!${NC}"
    read -p "Are you sure? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
      echo "Cancelled"
      exit 0
    fi
    if command -v ncu &> /dev/null; then
      ncu -u
      npm install --legacy-peer-deps
    else
      echo -e "${RED}❌ npm-check-updates not installed${NC}"
      exit 1
    fi
    ;;
  4)
    echo -e "${BLUE}🔧 Fixing security issues...${NC}"
    npm audit fix --legacy-peer-deps
    ;;
  *)
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
    ;;
esac
echo ""

# Test after update
echo -e "${BLUE}🧪 Testing updates...${NC}"
echo ""

# 1. Type check
echo -e "${BLUE}1️⃣  Type checking...${NC}"
npm run type-check
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Type check passed${NC}"
else
  echo -e "${RED}❌ Type check failed${NC}"
  read -p "Continue anyway? (y/n): " continue_anyway
  if [ "$continue_anyway" != "y" ]; then
    echo "Rolling back..."
    mv package.json.backup package.json
    mv package-lock.json.backup package-lock.json 2>/dev/null || true
    npm install --legacy-peer-deps
    exit 1
  fi
fi
echo ""

# 2. Lint
echo -e "${BLUE}2️⃣  Linting...${NC}"
npm run lint
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Lint passed${NC}"
else
  echo -e "${YELLOW}⚠️  Lint warnings (continuing)${NC}"
fi
echo ""

# 3. Build
echo -e "${BLUE}3️⃣  Building...${NC}"
npm run build
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Build successful${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  read -p "Roll back? (y/n): " rollback
  if [ "$rollback" = "y" ]; then
    echo "Rolling back..."
    mv package.json.backup package.json
    mv package-lock.json.backup package-lock.json 2>/dev/null || true
    npm install --legacy-peer-deps
    exit 1
  fi
fi
echo ""

# 4. Tests (optional)
echo -e "${BLUE}4️⃣  Running tests...${NC}"
npm test || echo -e "${YELLOW}⚠️  Tests had issues (continuing)${NC}"
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Update Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show what changed
echo -e "${BLUE}📝 Changes:${NC}"
diff package.json.backup package.json || true
echo ""

# Clean up backup
read -p "Remove backup files? (y/n, default: n): " remove_backup
if [ "$remove_backup" = "y" ]; then
  rm -f package.json.backup package-lock.json.backup
  echo -e "${GREEN}✅ Backup removed${NC}"
else
  echo -e "${YELLOW}💾 Backup kept (package.json.backup)${NC}"
fi
echo ""

echo "💡 Next steps:"
echo "  • Test locally: npm run dev"
echo "  • Commit changes: git add package.json package-lock.json"
echo "  • Deploy: npm run deploy"
echo ""
