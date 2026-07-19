#!/bin/bash
# Validate all JSON files in the project
# Usage: ./scripts/validate-json.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
TOTAL=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Validating JSON Files${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Find all JSON files, excluding node_modules and other directories
JSON_FILES=$(find . -name "*.json" \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/.npm/*" \
  -not -path "*/.vscode/*" \
  -not -path "*/coverage/*" \
  -not -path "*/.git/*" \
  -not -path "*/.history/*" \
  -not -path "*/.claude/*" \
  -type f)

if [ -z "$JSON_FILES" ]; then
  echo -e "${YELLOW}⚠️  No JSON files found${NC}"
  exit 0
fi

echo -e "${BLUE}Found JSON files:${NC}"
echo "$JSON_FILES" | sed 's/^/  /'
echo ""

# Validate each JSON file
for file in $JSON_FILES; do
  TOTAL=$((TOTAL + 1))

  # Check if file is valid JSON
  if python3 -m json.tool "$file" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} $file"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌${NC} $file"
    echo -e "   ${RED}Invalid JSON syntax${NC}"
    python3 -m json.tool "$file" 2>&1 | head -5 | sed 's/^/   /'
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "  Total:  $TOTAL"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All JSON files are valid!${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILED JSON file(s) have syntax errors${NC}"
  exit 1
fi
