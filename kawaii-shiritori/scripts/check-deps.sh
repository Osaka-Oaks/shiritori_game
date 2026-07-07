#!/bin/bash

# 📦 Dependency Health Check Script
# Checks versions, security, and updates

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📦 Dependency Health Check"
echo "=========================="
echo ""

# 1. Check Node version
echo -e "${BLUE}1️⃣  Node.js Version${NC}"
node --version
npm --version
echo ""

# 2. Check for outdated packages
echo -e "${BLUE}2️⃣  Checking for outdated packages...${NC}"
npm outdated || echo -e "${GREEN}✅ All packages up to date!${NC}"
echo ""

# 3. Security audit
echo -e "${BLUE}3️⃣  Running security audit...${NC}"
npm audit --json > /tmp/audit-result.json 2>&1 || true

VULNERABILITIES=$(cat /tmp/audit-result.json | grep -o '"vulnerabilities":{[^}]*}' | grep -o '"total":[0-9]*' | cut -d':' -f2)

if [ "$VULNERABILITIES" = "0" ] || [ -z "$VULNERABILITIES" ]; then
  echo -e "${GREEN}✅ No vulnerabilities found!${NC}"
else
  echo -e "${YELLOW}⚠️  Found $VULNERABILITIES vulnerabilities${NC}"
  echo "Run: npm audit fix --legacy-peer-deps"
fi
rm -f /tmp/audit-result.json
echo ""

# 4. Check for unused dependencies
echo -e "${BLUE}4️⃣  Checking for unused dependencies...${NC}"
if command -v depcheck &> /dev/null; then
  depcheck --json > /tmp/depcheck-result.json
  UNUSED=$(cat /tmp/depcheck-result.json | grep -o '"dependencies":\[[^\]]*\]' | grep -o '\[.*\]')
  if [ "$UNUSED" = "[]" ] || [ -z "$UNUSED" ]; then
    echo -e "${GREEN}✅ No unused dependencies!${NC}"
  else
    echo -e "${YELLOW}⚠️  Unused dependencies found:${NC}"
    cat /tmp/depcheck-result.json | jq '.dependencies'
  fi
  rm -f /tmp/depcheck-result.json
else
  echo -e "${YELLOW}💡 Install depcheck for unused dependency detection:${NC}"
  echo "   npm install -g depcheck"
fi
echo ""

# 5. Check bundle size
echo -e "${BLUE}5️⃣  Checking bundle size...${NC}"
if [ -d "dist" ]; then
  DIST_SIZE=$(du -sh dist | cut -f1)
  echo -e "${GREEN}📦 Build size: $DIST_SIZE${NC}"
  
  # Warn if too large
  DIST_SIZE_MB=$(du -sm dist | cut -f1)
  if [ "$DIST_SIZE_MB" -gt 5 ]; then
    echo -e "${YELLOW}⚠️  Bundle is large (>5MB). Consider:${NC}"
    echo "   - Code splitting"
    echo "   - Lazy loading"
    echo "   - Tree shaking"
  fi
else
  echo -e "${YELLOW}⚠️  No dist folder. Run: npm run build${NC}"
fi
echo ""

# 6. Check TypeScript
echo -e "${BLUE}6️⃣  TypeScript version check...${NC}"
npx tsc --version
echo ""

# 7. Check for major updates available
echo -e "${BLUE}7️⃣  Checking for major updates...${NC}"
if command -v ncu &> /dev/null; then
  ncu -u --target minor
else
  echo -e "${YELLOW}💡 Install npm-check-updates for update checking:${NC}"
  echo "   npm install -g npm-check-updates"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Dependency health check complete!"
echo ""
echo "📝 Recommendations:"
echo "  • Update outdated packages: npm update --legacy-peer-deps"
echo "  • Fix vulnerabilities: npm audit fix --legacy-peer-deps"
echo "  • Check DEPENDENCIES.md for package details"
echo ""
