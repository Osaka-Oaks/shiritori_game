#!/bin/bash

# Debug Module Script
# Usage: ./debug-module.sh <module-name>

set -e

MODULE=$1

if [ -z "$MODULE" ]; then
  echo "❌ Error: Module name required"
  echo "Usage: ./debug-module.sh <module-name>"
  echo ""
  echo "Available modules:"
  echo "  - core"
  echo "  - ui"
  echo "  - firebase"
  echo "  - game-2d"
  echo "  - shared"
  echo "  - app"
  exit 1
fi

echo "🔍 Debugging @shiritori/$MODULE package..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if package exists
PACKAGE_DIR="packages/$MODULE"
if [ ! -d "$PACKAGE_DIR" ]; then
  echo -e "${RED}❌ Package not found: $PACKAGE_DIR${NC}"
  exit 1
fi

echo -e "${BLUE}📦 Package: @shiritori/$MODULE${NC}"
echo -e "${BLUE}📁 Location: $PACKAGE_DIR${NC}"
echo ""

# 1. Check package.json
echo -e "${GREEN}1️⃣  Checking package.json...${NC}"
if [ -f "$PACKAGE_DIR/package.json" ]; then
  echo "✅ package.json found"
  
  # Check for required scripts
  SCRIPTS=("build" "test" "lint" "typecheck")
  for script in "${SCRIPTS[@]}"; do
    if grep -q "\"$script\"" "$PACKAGE_DIR/package.json"; then
      echo "  ✅ $script script defined"
    else
      echo -e "  ${YELLOW}⚠️  $script script missing${NC}"
    fi
  done
else
  echo -e "${RED}❌ package.json not found${NC}"
fi
echo ""

# 2. Check dependencies
echo -e "${GREEN}2️⃣  Checking dependencies...${NC}"
cd "$PACKAGE_DIR"
if pnpm list 2>/dev/null; then
  echo "✅ Dependencies installed"
else
  echo -e "${YELLOW}⚠️  Dependencies not installed. Run: pnpm install${NC}"
fi
cd - > /dev/null
echo ""

# 3. Run type check
echo -e "${GREEN}3️⃣  Running type check...${NC}"
if pnpm --filter @shiritori/$MODULE typecheck 2>&1 | tee /tmp/typecheck-$MODULE.log; then
  echo "✅ Type check passed"
else
  echo -e "${RED}❌ Type check failed. See /tmp/typecheck-$MODULE.log for details${NC}"
  cat /tmp/typecheck-$MODULE.log
fi
echo ""

# 4. Run linter
echo -e "${GREEN}4️⃣  Running linter...${NC}"
if pnpm --filter @shiritori/$MODULE lint 2>&1 | tee /tmp/lint-$MODULE.log; then
  echo "✅ Linting passed"
else
  echo -e "${YELLOW}⚠️  Linting issues found. See /tmp/lint-$MODULE.log for details${NC}"
fi
echo ""

# 5. Run tests
echo -e "${GREEN}5️⃣  Running tests...${NC}"
if pnpm --filter @shiritori/$MODULE test 2>&1 | tee /tmp/test-$MODULE.log; then
  echo "✅ Tests passed"
else
  echo -e "${RED}❌ Tests failed. See /tmp/test-$MODULE.log for details${NC}"
  cat /tmp/test-$MODULE.log
fi
echo ""

# 6. Check for errors in logs
echo -e "${GREEN}6️⃣  Checking for recent errors...${NC}"
if [ -f "$PACKAGE_DIR/error.log" ]; then
  ERROR_COUNT=$(wc -l < "$PACKAGE_DIR/error.log")
  if [ "$ERROR_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Found $ERROR_COUNT errors in error.log${NC}"
    echo "Last 10 errors:"
    tail -10 "$PACKAGE_DIR/error.log"
  else
    echo "✅ No errors in log"
  fi
else
  echo "✅ No error log found"
fi
echo ""

# 7. Build the package
echo -e "${GREEN}7️⃣  Building package...${NC}"
if pnpm --filter @shiritori/$MODULE build 2>&1 | tee /tmp/build-$MODULE.log; then
  echo "✅ Build successful"
  
  # Check build output
  if [ -d "$PACKAGE_DIR/dist" ]; then
    BUILD_SIZE=$(du -sh "$PACKAGE_DIR/dist" | cut -f1)
    echo "  📦 Build size: $BUILD_SIZE"
    echo "  📁 Output: $PACKAGE_DIR/dist"
  fi
else
  echo -e "${RED}❌ Build failed. See /tmp/build-$MODULE.log for details${NC}"
  cat /tmp/build-$MODULE.log
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Debug Summary for @shiritori/$MODULE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check all logs
ALL_PASSED=true

if grep -q "error" /tmp/typecheck-$MODULE.log 2>/dev/null; then
  echo -e "${RED}❌ Type check: FAILED${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✅ Type check: PASSED${NC}"
fi

if grep -q "error" /tmp/lint-$MODULE.log 2>/dev/null; then
  echo -e "${YELLOW}⚠️  Lint: WARNINGS${NC}"
else
  echo -e "${GREEN}✅ Lint: PASSED${NC}"
fi

if grep -q "FAIL" /tmp/test-$MODULE.log 2>/dev/null; then
  echo -e "${RED}❌ Tests: FAILED${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✅ Tests: PASSED${NC}"
fi

if grep -q "error" /tmp/build-$MODULE.log 2>/dev/null; then
  echo -e "${RED}❌ Build: FAILED${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✅ Build: PASSED${NC}"
fi

echo ""

if [ "$ALL_PASSED" = true ]; then
  echo -e "${GREEN}🎉 All checks passed for @shiritori/$MODULE!${NC}"
  exit 0
else
  echo -e "${RED}💔 Some checks failed for @shiritori/$MODULE${NC}"
  echo ""
  echo "Debug logs saved to:"
  echo "  - /tmp/typecheck-$MODULE.log"
  echo "  - /tmp/lint-$MODULE.log"
  echo "  - /tmp/test-$MODULE.log"
  echo "  - /tmp/build-$MODULE.log"
  exit 1
fi
