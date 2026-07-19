#!/bin/bash

# 🧹 Search for Personal References Script
# Helps find and remove personal content from codebase

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Searching for Personal References"
echo "====================================="
echo ""

# Common personal reference patterns
PATTERNS=(
  "For Mei"
  "メイへ"
  "I love you"
  "あいしてる"
  "Forever yours"
  "ずっと"
  "husband"
  "wife"
  "darling"
  "sweetheart"
  "Melvin"
  "Mei"
  "made this.*for"
)

echo -e "${BLUE}Scanning source code...${NC}"
echo ""

FOUND=0

for pattern in "${PATTERNS[@]}"; do
  RESULTS=$(grep -r -i "$pattern" src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true)
  
  if [ -n "$RESULTS" ]; then
    echo -e "${YELLOW}⚠️  Found: \"$pattern\"${NC}"
    echo "$RESULTS"
    echo ""
    FOUND=$((FOUND + 1))
  fi
done

if [ $FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ No personal references found!${NC}"
  echo ""
  echo "Your codebase is clean."
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}Found $FOUND pattern(s) with matches${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Review the matches above and remove them manually."
fi

echo ""
echo -e "${BLUE}Checking placeholders...${NC}"

# Check common placeholder locations
PLACEHOLDER_FILES=(
  "src/components/AuthView.tsx"
  "src/components/LibraryView.tsx"
  "src/components/HomeView.tsx"
  "src/components/AvatarPickerView.tsx"
)

for file in "${PLACEHOLDER_FILES[@]}"; do
  if [ -f "$file" ]; then
    PLACEHOLDERS=$(grep -n "placeholder=" "$file" 2>/dev/null || true)
    if [ -n "$PLACEHOLDERS" ]; then
      echo ""
      echo -e "${BLUE}📄 $file:${NC}"
      echo "$PLACEHOLDERS"
    fi
  fi
done

echo ""
echo -e "${BLUE}Checking deployed site...${NC}"
SITE_URL="https://shiritori-game-ccaae.web.app"

# Check if site contains personal references
SITE_CHECK=$(curl -s "$SITE_URL" | grep -i "For Mei\|メイへ\|Forever yours" || true)

if [ -n "$SITE_CHECK" ]; then
  echo -e "${YELLOW}⚠️  Personal references found on LIVE SITE${NC}"
  echo ""
  echo "The deployed version contains personal content."
  echo "Redeploy to update:"
  echo "  npm run deploy:hosting"
else
  echo -e "${GREEN}✅ Live site is clean${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Recommended generic placeholders:"
echo ""
echo "  Names: Player1, User123, Gamer42"
echo "  Words: さくら, りんご, ねこ"
echo "  Examples: Use hiragana consistently"
echo ""
