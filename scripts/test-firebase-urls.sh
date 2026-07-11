#!/usr/bin/env bash
# Test Firebase deployment URLs and verify they're live
# Usage: bash scripts/test-firebase-urls.sh

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Testing Firebase Deployment URLs..."
echo ""

# URLs to test
declare -A URLS=(
    ["React App (Production)"]="https://shiritori-game-ccaae.web.app"
    ["React App (Alt)"]="https://shiritori-game-ccaae.firebaseapp.com"
    ["Flutter App"]="https://shiritori-flutter.web.app"
)

FAILED=0

# Test each URL
for name in "${!URLS[@]}"; do
    url="${URLS[$name]}"
    echo -n "Testing $name ... "
    
    # Get HTTP status code
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")
    
    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $STATUS)"
        
        # Get response time
        RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$url" 2>/dev/null || echo "N/A")
        echo "   Response time: ${RESPONSE_TIME}s"
        
        # Check content
        CONTENT=$(curl -s "$url" | head -c 500)
        if echo "$CONTENT" | grep -qi "flutter\|shiritori\|html"; then
            echo -e "   Content: ${GREEN}Valid${NC}"
        else
            echo -e "   Content: ${YELLOW}Unexpected${NC}"
        fi
    elif [ "$STATUS" = "000" ]; then
        echo -e "${RED}❌ TIMEOUT${NC}"
        FAILED=1
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $STATUS)"
        FAILED=1
    fi
    echo ""
done

# Test Firebase Hosting API
echo "🔧 Testing Firebase Hosting Configuration..."
FIREBASE_PROJECT="shiritori-game-ccaae"

# Check if firebase CLI is installed
if command -v firebase &> /dev/null; then
    echo -n "Firebase CLI: "
    echo -e "${GREEN}✅ Installed${NC}"
    firebase --version
    
    # List hosting sites (requires authentication)
    echo ""
    echo "To list hosting sites, run:"
    echo "  firebase hosting:sites:list --project $FIREBASE_PROJECT"
else
    echo -e "${YELLOW}⚠️  Firebase CLI not installed${NC}"
    echo "Install with: npm install -g firebase-tools"
fi

echo ""
echo "============================================"
if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}✅ All Firebase URLs are live!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some URLs failed. Check deployment.${NC}"
    exit 1
fi
