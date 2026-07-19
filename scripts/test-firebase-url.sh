#!/bin/bash
# Comprehensive Firebase URL testing with labeled reports
# Usage: ./scripts/test-firebase-url.sh [url] [environment]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default URLs
PROD_URL="https://shiritori-game-ccaae.web.app"
STAGING_URL="https://shiritori-game-ccaae--develop.web.app"

# Parse arguments
URL="${1:-$PROD_URL}"
ENV="${2:-production}"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Firebase URL Testing${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}URL:${NC} $URL"
echo -e "${CYAN}Environment:${NC} $ENV"
echo -e "${CYAN}Timestamp:${NC} $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# Test 1: Homepage accessibility
echo -e "${YELLOW}[1/10] Testing homepage accessibility...${NC}"
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" $URL)
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" $URL)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Homepage accessible (HTTP $HTTP_CODE, ${RESPONSE_TIME}s)${NC}"
    echo "   #homepage #http200 #accessible"
    ((PASSED++))
else
    echo -e "${RED}❌ Homepage failed (HTTP $HTTP_CODE)${NC}"
    echo "   #homepage #http$HTTP_CODE #failed"
    ((FAILED++))
fi

# Test 2: Version endpoint
echo -e "${YELLOW}[2/10] Checking version endpoint...${NC}"
VERSION_URL="$URL/version.json"
VERSION_CODE=$(curl -o /dev/null -s -w "%{http_code}" $VERSION_URL 2>/dev/null || echo "000")

if [ "$VERSION_CODE" -eq 200 ]; then
    VERSION_DATA=$(curl -s $VERSION_URL)
    VERSION=$(echo $VERSION_DATA | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    TAGS=$(echo $VERSION_DATA | grep -o '"tags":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Version endpoint found${NC}"
    echo "   Version: $VERSION"
    echo "   Tags: $TAGS"
    echo "   #version #endpoint"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Version endpoint not found (expected for older deployments)${NC}"
    echo "   #version #notfound"
    ((WARNINGS++))
fi

# Test 3: Content verification
echo -e "${YELLOW}[3/10] Verifying page content...${NC}"
CONTENT=$(curl -s $URL)

if echo "$CONTENT" | grep -q "しりとり\|Shiritori"; then
    echo -e "${GREEN}✅ Expected Japanese content found${NC}"
    echo "   #content #japanese #verified"
    ((PASSED++))
else
    echo -e "${RED}❌ Expected content not found${NC}"
    echo "   #content #missing #failed"
    ((FAILED++))
fi

# Test 4: Assets loading
echo -e "${YELLOW}[4/10] Checking asset references...${NC}"
if echo "$CONTENT" | grep -qE '<script|<link.*stylesheet|<img'; then
    echo -e "${GREEN}✅ Assets referenced in HTML${NC}"
    echo "   #assets #loaded"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  No obvious asset references${NC}"
    echo "   #assets #noref"
    ((WARNINGS++))
fi

# Test 5: Performance test
echo -e "${YELLOW}[5/10] Running performance test (5 samples)...${NC}"
TOTAL_TIME=0
for i in {1..5}; do
    TIME=$(curl -o /dev/null -s -w "%{time_total}" $URL)
    TOTAL_TIME=$(echo "$TOTAL_TIME + $TIME" | bc)
    echo -n "."
done
echo ""

AVG_TIME=$(echo "scale=3; $TOTAL_TIME / 5" | bc)
if (( $(echo "$AVG_TIME < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ Average response time: ${AVG_TIME}s (<2s)${NC}"
    echo "   #performance #fast"
    ((PASSED++))
elif (( $(echo "$AVG_TIME < 5.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Average response time: ${AVG_TIME}s (acceptable)${NC}"
    echo "   #performance #acceptable"
    ((WARNINGS++))
else
    echo -e "${RED}❌ Average response time: ${AVG_TIME}s (>5s)${NC}"
    echo "   #performance #slow"
    ((FAILED++))
fi

# Test 6: Security headers
echo -e "${YELLOW}[6/10] Checking security headers...${NC}"
HEADERS=$(curl -I -s $URL)

if echo "$HEADERS" | grep -qi "x-content-type-options\|x-frame-options\|strict-transport"; then
    echo -e "${GREEN}✅ Security headers present${NC}"
    echo "   #security #headers #present"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Some security headers missing${NC}"
    echo "   #security #headers #missing"
    ((WARNINGS++))
fi

# Test 7: Firebase hosting verification
echo -e "${YELLOW}[7/10] Verifying Firebase hosting...${NC}"
if echo "$HEADERS" | grep -qi "firebase"; then
    echo -e "${GREEN}✅ Served by Firebase Hosting${NC}"
    echo "   #firebase #hosting #verified"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Firebase hosting header not found${NC}"
    echo "   #firebase #hosting #unverified"
    ((WARNINGS++))
fi

# Test 8: Route testing
echo -e "${YELLOW}[8/10] Testing SPA routes...${NC}"
ROUTES=("/" "/game" "/leaderboard" "/history")
ROUTE_PASS=0

for ROUTE in "${ROUTES[@]}"; do
    ROUTE_CODE=$(curl -o /dev/null -s -w "%{http_code}" "$URL$ROUTE")
    if [ "$ROUTE_CODE" -eq 200 ]; then
        echo -e "  ${GREEN}✅${NC} $ROUTE (HTTP $ROUTE_CODE)"
        ((ROUTE_PASS++))
    else
        echo -e "  ${YELLOW}⚠️${NC} $ROUTE (HTTP $ROUTE_CODE)"
    fi
done

if [ "$ROUTE_PASS" -eq "${#ROUTES[@]}" ]; then
    echo -e "${GREEN}✅ All routes accessible${NC}"
    echo "   #routes #spa #working"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  $ROUTE_PASS/${#ROUTES[@]} routes accessible${NC}"
    echo "   #routes #spa #partial"
    ((WARNINGS++))
fi

# Test 9: Database connectivity
echo -e "${YELLOW}[9/10] Testing database connectivity...${NC}"
DB_URL="https://shiritori-game-ccaae-default-rtdb.firebaseio.com/.json"
DB_CODE=$(curl -o /dev/null -s -w "%{http_code}" $DB_URL 2>/dev/null || echo "000")

if [ "$DB_CODE" -eq 401 ] || [ "$DB_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Realtime Database accessible (HTTP $DB_CODE)${NC}"
    echo "   #database #rtdb #accessible"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Database status unclear (HTTP $DB_CODE)${NC}"
    echo "   #database #rtdb #unclear"
    ((WARNINGS++))
fi

# Test 10: SSL certificate
echo -e "${YELLOW}[10/10] Checking SSL certificate...${NC}"
if curl -s --head $URL | grep -q "HTTP/2\|HTTPS"; then
    echo -e "${GREEN}✅ HTTPS enabled${NC}"
    echo "   #ssl #https #secure"
    ((PASSED++))
else
    echo -e "${RED}❌ HTTPS not detected${NC}"
    echo "   #ssl #https #missing"
    ((FAILED++))
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed:${NC}   $PASSED"
echo -e "  ${YELLOW}⚠️  Warnings:${NC} $WARNINGS"
echo -e "  ${RED}❌ Failed:${NC}   $FAILED"
echo ""

# Labels/Tags
LABELS="#testing #firebase #$ENV"
if [ $FAILED -eq 0 ]; then
    LABELS="$LABELS #healthy #passing"
    echo -e "${GREEN}🎉 All critical tests passed!${NC}"
    STATUS="✅ HEALTHY"
elif [ $FAILED -lt 3 ]; then
    LABELS="$LABELS #warning #degraded"
    echo -e "${YELLOW}⚠️  Some tests failed - deployment may be degraded${NC}"
    STATUS="⚠️ WARNING"
else
    LABELS="$LABELS #failed #unhealthy"
    echo -e "${RED}❌ Critical failures detected!${NC}"
    STATUS="❌ FAILED"
fi

echo ""
echo -e "${CYAN}Status:${NC} $STATUS"
echo -e "${CYAN}Labels:${NC} $LABELS"
echo -e "${CYAN}URL:${NC} $URL"
echo -e "${CYAN}Tested:${NC} $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Create summary file
SUMMARY_FILE=".github/test-summary-$(date +%Y%m%d-%H%M%S).md"
mkdir -p .github

cat > "$SUMMARY_FILE" << EOF
# 🧪 Firebase URL Test Report

**URL**: $URL
**Environment**: $ENV
**Status**: $STATUS
**Timestamp**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Results

- ✅ Passed: $PASSED
- ⚠️  Warnings: $WARNINGS
- ❌ Failed: $FAILED

## Labels

$LABELS

## Details

- Homepage: HTTP $HTTP_CODE (${RESPONSE_TIME}s)
- Performance: ${AVG_TIME}s average
- Routes: $ROUTE_PASS/${#ROUTES[@]} accessible
- Database: HTTP $DB_CODE

---
*Generated by test-firebase-url.sh*
EOF

echo -e "${BLUE}Report saved:${NC} $SUMMARY_FILE"
echo ""

# Exit code
if [ $FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
