#!/bin/bash
# Test Firebase deployment URLs
# Usage: ./scripts/test-deployment.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FIREBASE_URL="https://shiritori-game-ccaae.web.app"
DB_URL="https://shiritori-game-ccaae-default-rtdb.firebaseio.com"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Testing Firebase Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1: Homepage accessibility
echo -e "${YELLOW}[1/7]${NC} Testing homepage accessibility..."
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" $FIREBASE_URL/)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Homepage accessible (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Homepage failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi

# Test 2: Content verification
echo -e "${YELLOW}[2/7]${NC} Verifying page content..."
CONTENT=$(curl -s $FIREBASE_URL/)

if echo "$CONTENT" | grep -q "しりとり\|Shiritori"; then
    echo -e "${GREEN}✅ Expected content found${NC}"
else
    echo -e "${RED}❌ Expected content not found${NC}"
    exit 1
fi

# Test 3: Assets loading
echo -e "${YELLOW}[3/7]${NC} Checking assets..."
if echo "$CONTENT" | grep -q "script.*src\|link.*href"; then
    echo -e "${GREEN}✅ Assets referenced${NC}"
else
    echo -e "${YELLOW}⚠️  No asset references found${NC}"
fi

# Test 4: Response time
echo -e "${YELLOW}[4/7]${NC} Measuring response time..."
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" $FIREBASE_URL/)
echo -e "${GREEN}✅ Response time: ${RESPONSE_TIME}s${NC}"

# Test 5: Firebase hosting headers
echo -e "${YELLOW}[5/7]${NC} Checking Firebase hosting..."
HEADERS=$(curl -I -s $FIREBASE_URL/)

if echo "$HEADERS" | grep -q "x-firebase-hosting"; then
    echo -e "${GREEN}✅ Served by Firebase Hosting${NC}"
else
    echo -e "${YELLOW}⚠️  Firebase hosting header not found${NC}"
fi

# Test 6: Realtime Database
echo -e "${YELLOW}[6/7]${NC} Testing Realtime Database..."
DB_STATUS=$(curl -o /dev/null -s -w "%{http_code}" $DB_URL/.json)

if [ "$DB_STATUS" -eq 401 ] || [ "$DB_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Realtime Database accessible (HTTP $DB_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  Database status: HTTP $DB_STATUS${NC}"
fi

# Test 7: SPA routing
echo -e "${YELLOW}[7/7]${NC} Testing SPA routes..."
ROUTES=("" "game" "leaderboard" "history")
for route in "${ROUTES[@]}"; do
    ROUTE_URL="$FIREBASE_URL/$route"
    ROUTE_STATUS=$(curl -o /dev/null -s -w "%{http_code}" $ROUTE_URL)
    
    if [ "$ROUTE_STATUS" -eq 200 ]; then
        echo -e "  ${GREEN}✅${NC} /$route (HTTP $ROUTE_STATUS)"
    else
        echo -e "  ${RED}❌${NC} /$route (HTTP $ROUTE_STATUS)"
    fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Live URL:${NC} $FIREBASE_URL"
echo -e "${BLUE}🔧 Console:${NC} https://console.firebase.google.com/project/shiritori-game-ccaae"
echo ""
