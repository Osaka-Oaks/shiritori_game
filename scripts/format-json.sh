#!/bin/bash
# Format all JSON files with Prettier
# Usage: ./scripts/format-json.sh [--check]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CHECK_MODE=false

# Parse arguments
if [ "$1" = "--check" ]; then
  CHECK_MODE=true
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$CHECK_MODE" = true ]; then
  echo -e "${BLUE}🔍 Checking JSON Formatting${NC}"
else
  echo -e "${BLUE}✨ Formatting JSON Files${NC}"
fi
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Build prettier command
if [ "$CHECK_MODE" = true ]; then
  PRETTIER_CMD="npx prettier --check"
else
  PRETTIER_CMD="npx prettier --write"
fi

# Run prettier on JSON files (excluding node_modules via .gitignore)
echo -e "${YELLOW}Running Prettier on JSON files...${NC}"
echo ""

# Only format JSON files, not YAML
if $PRETTIER_CMD \
  "*.json" \
  "shiritori-online/**/*.json" \
  "kawaii-shiritori/**/*.json" \
  "shiritori-word-chain/**/*.json" \
  --ignore-path .gitignore 2>&1 | grep -v "No files matching"; then
  echo ""
  if [ "$CHECK_MODE" = true ]; then
    echo -e "${GREEN}✅ All JSON files are properly formatted!${NC}"
  else
    echo -e "${GREEN}✅ All JSON files have been formatted!${NC}"
  fi
  exit 0
else
  echo ""
  if [ "$CHECK_MODE" = true ]; then
    echo -e "${RED}❌ Some JSON files need formatting${NC}"
    echo -e "${YELLOW}Run: npm run format:json${NC}"
  else
    echo -e "${RED}❌ Failed to format some JSON files${NC}"
  fi
  exit 1
fi
