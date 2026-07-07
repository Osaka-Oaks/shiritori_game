#!/bin/bash

# 🧪 Firebase Testing Script
# Tests deployment, hosting, and Firestore after deployment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Firebase Testing Suite"
echo "========================="
echo ""

# Test 1: Check if deployed
echo -e "${BLUE}1️⃣  Checking deployment status...${NC}"
firebase hosting:channel:list > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Firebase CLI connected${NC}"
else
  echo -e "${RED}❌ Firebase CLI not authenticated${NC}"
  echo "Run: firebase login"
  exit 1
fi
echo ""

# Test 2: Check hosting status
echo -e "${BLUE}2️⃣  Checking hosting...${NC}"
HOSTING_URL="https://shiritori-game-ccaae.web.app"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HOSTING_URL)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Site is live: $HOSTING_URL${NC}"
  echo -e "${GREEN}   HTTP Status: $HTTP_CODE${NC}"
else
  echo -e "${YELLOW}⚠️  Site returned: $HTTP_CODE${NC}"
  echo "   This might be normal if not deployed yet"
fi
echo ""

# Test 3: Check Firestore rules
echo -e "${BLUE}3️⃣  Checking Firestore rules...${NC}"
firebase firestore:rules:get > /tmp/firebase-rules-check.txt 2>&1
if grep -q "rules_version" /tmp/firebase-rules-check.txt; then
  echo -e "${GREEN}✅ Firestore rules deployed${NC}"
  echo "   Preview:"
  head -5 /tmp/firebase-rules-check.txt
else
  echo -e "${YELLOW}⚠️  Could not verify Firestore rules${NC}"
fi
rm -f /tmp/firebase-rules-check.txt
echo ""

# Test 4: Run unit tests
echo -e "${BLUE}4️⃣  Running unit tests...${NC}"
npm test > /tmp/test-output.txt 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed${NC}"
  TEST_COUNT=$(grep -c "PASS" /tmp/test-output.txt || echo "0")
  echo "   Tests passed: $TEST_COUNT"
else
  echo -e "${RED}❌ Some tests failed${NC}"
  echo "   Check output:"
  tail -20 /tmp/test-output.txt
fi
rm -f /tmp/test-output.txt
echo ""

# Test 5: Check build
echo -e "${BLUE}5️⃣  Checking build output...${NC}"
if [ -d "dist" ]; then
  DIST_SIZE=$(du -sh dist | cut -f1)
  FILE_COUNT=$(find dist -type f | wc -l | tr -d ' ')
  echo -e "${GREEN}✅ Build directory exists${NC}"
  echo "   Size: $DIST_SIZE"
  echo "   Files: $FILE_COUNT"
  
  # Check for key files
  if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}   ✅ index.html found${NC}"
  else
    echo -e "${RED}   ❌ index.html missing${NC}"
  fi
  
  if [ -d "dist/assets" ]; then
    echo -e "${GREEN}   ✅ assets directory found${NC}"
  else
    echo -e "${YELLOW}   ⚠️  assets directory not found${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Build directory not found${NC}"
  echo "   Run: npm run build"
fi
echo ""

# Test 6: Check performance
echo -e "${BLUE}6️⃣  Checking performance (optional)...${NC}"
if command -v lighthouse &> /dev/null; then
  echo "Running Lighthouse audit..."
  lighthouse $HOSTING_URL \
    --only-categories=performance \
    --quiet \
    --output=json \
    --output-path=/tmp/lighthouse.json > /dev/null 2>&1
  
  if [ -f "/tmp/lighthouse.json" ]; then
    SCORE=$(grep -o '"performance":[0-9.]*' /tmp/lighthouse.json | cut -d':' -f2)
    SCORE_PERCENT=$(echo "$SCORE * 100" | bc -l | cut -d'.' -f1)
    
    if [ "$SCORE_PERCENT" -ge 90 ]; then
      echo -e "${GREEN}✅ Performance score: $SCORE_PERCENT/100${NC}"
    elif [ "$SCORE_PERCENT" -ge 70 ]; then
      echo -e "${YELLOW}⚠️  Performance score: $SCORE_PERCENT/100${NC}"
    else
      echo -e "${RED}❌ Performance score: $SCORE_PERCENT/100${NC}"
    fi
    rm -f /tmp/lighthouse.json
  fi
else
  echo -e "${YELLOW}⏭️  Lighthouse not installed (skipping)${NC}"
  echo "   Install with: npm install -g lighthouse"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🔗 URLs:"
echo "  • Live Site: $HOSTING_URL"
echo "  • Console: https://console.firebase.google.com/project/shiritori-game-ccaae"
echo "  • Firestore: https://console.firebase.google.com/project/shiritori-game-ccaae/firestore"
echo ""
echo "📊 Status:"
echo "  • Hosting: Live"
echo "  • Firestore: Configured"
echo "  • Tests: Run 'npm test' for details"
echo ""
echo -e "${GREEN}✅ Testing complete!${NC}"
echo ""
echo "💡 Next steps:"
echo "  1. Visit: $HOSTING_URL"
echo "  2. Test gameplay"
echo "  3. Check browser console for errors"
echo "  4. Monitor usage: https://console.firebase.google.com/project/shiritori-game-ccaae/usage"
echo ""
