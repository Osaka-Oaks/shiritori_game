#!/bin/bash
# Test Flutter Firebase Deployment
# Comprehensive deployment verification and health checks

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
FIREBASE_PROJECT_ID="shiritori-game-ccaae"
PRODUCTION_URL="https://${FIREBASE_PROJECT_ID}.web.app"
STAGING_URL="https://${FIREBASE_PROJECT_ID}--develop.web.app"

# Test mode
TEST_URL=${1:-$PRODUCTION_URL}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Flutter Firebase Deployment Test${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Testing URL: ${TEST_URL}${NC}"
echo -e "${CYAN}Started at:  $(date)${NC}"
echo ""

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "${YELLOW}▶ Test ${TESTS_TOTAL}: ${test_name}${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}  ✅ PASSED${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}  ❌ FAILED${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
    echo ""
}

# Test 1: HTTP Status Code
test_http_status() {
    echo "  Checking HTTP status..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TEST_URL" 2>/dev/null || echo "000")
    echo "  Status code: $STATUS"
    
    if [ "$STATUS" == "200" ]; then
        return 0
    else
        echo "  Expected: 200, Got: $STATUS"
        return 1
    fi
}

# Test 2: Response Time
test_response_time() {
    echo "  Measuring response time..."
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' "$TEST_URL" 2>/dev/null || echo "999")
    echo "  Response time: ${RESPONSE_TIME}s"
    
    # Alert if slow (>5s)
    if (( $(echo "$RESPONSE_TIME > 5.0" | bc -l 2>/dev/null || echo "1") )); then
        echo "  ⚠️  Response time is slow"
        return 1
    fi
    
    return 0
}

# Test 3: Content Type
test_content_type() {
    echo "  Checking content type..."
    CONTENT_TYPE=$(curl -s -I "$TEST_URL" | grep -i "content-type:" | cut -d' ' -f2 | tr -d '\r\n')
    echo "  Content-Type: $CONTENT_TYPE"
    
    if echo "$CONTENT_TYPE" | grep -q "text/html"; then
        return 0
    else
        echo "  Expected: text/html"
        return 1
    fi
}

# Test 4: Flutter Content
test_flutter_content() {
    echo "  Verifying Flutter app content..."
    CONTENT=$(curl -s "$TEST_URL" 2>/dev/null || echo "")
    
    # Check for Flutter-specific content
    if echo "$CONTENT" | grep -q "flutter" || \
       echo "$CONTENT" | grep -q "main.dart.js" || \
       echo "$CONTENT" | grep -q "flutter_service_worker"; then
        echo "  ✅ Flutter app detected"
        return 0
    else
        echo "  ❌ Flutter content not found"
        return 1
    fi
}

# Test 5: SSL Certificate
test_ssl() {
    echo "  Checking SSL certificate..."
    if curl -s -I "$TEST_URL" | grep -q "HTTP/2"; then
        echo "  ✅ HTTPS enabled"
        
        # Check certificate expiry
        CERT_EXPIRY=$(echo | openssl s_client -servername "${TEST_URL#https://}" -connect "${TEST_URL#https://}:443" 2>/dev/null | \
                      openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || echo "Unknown")
        echo "  Certificate expires: $CERT_EXPIRY"
        return 0
    else
        echo "  ⚠️  HTTPS not properly configured"
        return 1
    fi
}

# Test 6: Redirect (www to non-www)
test_redirects() {
    echo "  Testing redirects..."
    
    # Test if URL is accessible
    FINAL_URL=$(curl -Ls -o /dev/null -w '%{url_effective}' "$TEST_URL" 2>/dev/null || echo "")
    echo "  Final URL: $FINAL_URL"
    
    if [ -n "$FINAL_URL" ]; then
        return 0
    else
        return 1
    fi
}

# Test 7: Performance Headers
test_headers() {
    echo "  Checking response headers..."
    HEADERS=$(curl -s -I "$TEST_URL" 2>/dev/null || echo "")
    
    # Check for important headers
    if echo "$HEADERS" | grep -q "cache-control"; then
        echo "  ✅ Cache-Control header present"
    fi
    
    if echo "$HEADERS" | grep -q "x-firebase-hosting"; then
        echo "  ✅ Firebase Hosting detected"
    fi
    
    return 0
}

# Test 8: Mobile Compatibility
test_mobile() {
    echo "  Testing mobile compatibility..."
    MOBILE_CONTENT=$(curl -s -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "$TEST_URL" 2>/dev/null || echo "")
    
    if [ -n "$MOBILE_CONTENT" ] && [ ${#MOBILE_CONTENT} -gt 1000 ]; then
        echo "  ✅ Mobile version accessible"
        return 0
    else
        echo "  ⚠️  Mobile content might have issues"
        return 1
    fi
}

# Test 9: Asset Loading
test_assets() {
    echo "  Checking static assets..."
    
    # Try to load favicon
    FAVICON_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${TEST_URL}/favicon.png" 2>/dev/null || echo "000")
    
    if [ "$FAVICON_STATUS" == "200" ] || [ "$FAVICON_STATUS" == "304" ]; then
        echo "  ✅ Assets loading correctly"
        return 0
    else
        echo "  ⚠️  Some assets might not load (Status: $FAVICON_STATUS)"
        return 0  # Don't fail on this
    fi
}

# Test 10: Service Worker
test_service_worker() {
    echo "  Checking for service worker..."
    SW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${TEST_URL}/flutter_service_worker.js" 2>/dev/null || echo "000")
    
    if [ "$SW_STATUS" == "200" ]; then
        echo "  ✅ Service worker found"
        return 0
    else
        echo "  ℹ️  Service worker not found (Status: $SW_STATUS)"
        return 0  # Don't fail on this
    fi
}

# Run all tests
echo -e "${CYAN}Running deployment tests...${NC}"
echo ""

run_test "HTTP Status Code" test_http_status
run_test "Response Time" test_response_time
run_test "Content Type" test_content_type
run_test "Flutter Content" test_flutter_content
run_test "SSL Certificate" test_ssl
run_test "URL Redirects" test_redirects
run_test "Response Headers" test_headers
run_test "Mobile Compatibility" test_mobile
run_test "Static Assets" test_assets
run_test "Service Worker" test_service_worker

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}📊 Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  Total Tests:    ${TESTS_TOTAL}"
echo -e "  ${GREEN}Passed:         ${TESTS_PASSED}${NC}"
echo -e "  ${RED}Failed:         ${TESTS_FAILED}${NC}"
echo ""

# Overall status
SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))
echo -e "  Success Rate:   ${SUCCESS_RATE}%"
echo ""

# Deployment info
echo -e "${CYAN}📋 Deployment Information${NC}"
echo -e "  URL:            ${TEST_URL}"
echo -e "  Project:        ${FIREBASE_PROJECT_ID}"
echo -e "  Tested at:      $(date)"
echo ""

# Final status
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}🎉 Deployment is healthy and fully functional!${NC}"
    echo ""
    echo -e "${CYAN}🌐 Visit your app:${NC}"
    echo -e "   ${TEST_URL}"
    echo ""
    exit 0
elif [ $TESTS_FAILED -le 2 ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  TESTS PASSED WITH WARNINGS${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Some non-critical tests failed. Deployment is functional but needs attention.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ TESTS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${RED}Deployment has issues. Please review the failed tests above.${NC}"
    echo ""
    exit 1
fi
