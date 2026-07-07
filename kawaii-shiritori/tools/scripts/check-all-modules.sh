#!/bin/bash

# Check All Modules Script
# Runs health checks on all packages in the monorepo

set -e

echo "🏥 Running health checks on all modules..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

MODULES=("shared" "core" "firebase" "game-2d" "ui" "app")
FAILED_MODULES=()
PASSED_MODULES=()

# Function to check a single module
check_module() {
  local module=$1
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}📦 Checking @shiritori/$module${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  
  # Check if package exists
  if [ ! -d "packages/$module" ]; then
    echo -e "${YELLOW}⚠️  Package not found, skipping...${NC}"
    return
  fi
  
  local passed=true
  
  # Type check
  echo -n "🔍 Type check... "
  if pnpm --filter @shiritori/$module typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
  else
    echo -e "${RED}❌${NC}"
    passed=false
  fi
  
  # Lint
  echo -n "🎨 Lint... "
  if pnpm --filter @shiritori/$module lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
  else
    echo -e "${YELLOW}⚠️${NC}"
  fi
  
  # Tests
  echo -n "🧪 Tests... "
  if pnpm --filter @shiritori/$module test > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
  else
    echo -e "${RED}❌${NC}"
    passed=false
  fi
  
  # Build
  echo -n "🏗️  Build... "
  if pnpm --filter @shiritori/$module build > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    
    # Check build size
    if [ -d "packages/$module/dist" ]; then
      SIZE=$(du -sh "packages/$module/dist" | cut -f1)
      echo "  📦 Build size: $SIZE"
    fi
  else
    echo -e "${RED}❌${NC}"
    passed=false
  fi
  
  echo ""
  
  if [ "$passed" = true ]; then
    PASSED_MODULES+=("$module")
  else
    FAILED_MODULES+=("$module")
  fi
}

# Check all modules
for module in "${MODULES[@]}"; do
  check_module "$module"
done

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✅ Passed: ${#PASSED_MODULES[@]}${NC}"
for module in "${PASSED_MODULES[@]}"; do
  echo "  - @shiritori/$module"
done

echo ""

if [ ${#FAILED_MODULES[@]} -gt 0 ]; then
  echo -e "${RED}❌ Failed: ${#FAILED_MODULES[@]}${NC}"
  for module in "${FAILED_MODULES[@]}"; do
    echo "  - @shiritori/$module"
  done
  echo ""
  echo -e "${YELLOW}Run ./tools/scripts/debug-module.sh <module> for detailed error information${NC}"
  exit 1
else
  echo -e "${GREEN}🎉 All modules passed health checks!${NC}"
  exit 0
fi
