#!/bin/bash
# Build Time Tracking Script
# Measures and logs build times for performance tracking

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Build time log file
LOG_FILE="build-times.log"
JSON_LOG="build-times.json"

# Get app name from argument or default
APP=${1:-"kawaii-shiritori"}
BUILD_TYPE=${2:-"production"}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}⏱️  Build Time Tracking - $APP${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Start timer
START_TIME=$(date +%s)
START_DATE=$(date +"%Y-%m-%d %H:%M:%S")

echo -e "${CYAN}Started at: $START_DATE${NC}"
echo ""

# Navigate to app directory
cd "$APP"

# Clean previous build (optional)
if [ "$CLEAN_BUILD" = "true" ]; then
    echo -e "${YELLOW}Cleaning previous build...${NC}"
    rm -rf dist/ build/ .vite/
fi

# Track dependency installation time
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    DEPS_START=$(date +%s)
    npm ci --prefer-offline --no-audit
    DEPS_END=$(date +%s)
    DEPS_TIME=$((DEPS_END - DEPS_START))
    echo -e "${GREEN}✅ Dependencies installed in ${DEPS_TIME}s${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Using cached dependencies${NC}"
    DEPS_TIME=0
    echo ""
fi

# Build with optimizations
echo -e "${YELLOW}Building $APP...${NC}"
BUILD_START=$(date +%s)

# Set build environment variables
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export CI=true

# Run build
npm run build 2>&1 | tee build.log

BUILD_END=$(date +%s)
BUILD_TIME=$((BUILD_END - BUILD_START))

# End timer
END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))
END_DATE=$(date +"%Y-%m-%d %H:%M:%S")

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Build Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Calculate build size
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    ASSET_COUNT=$(find dist/ -type f | wc -l)
elif [ -d "build" ]; then
    BUILD_SIZE=$(du -sh build/ | cut -f1)
    ASSET_COUNT=$(find build/ -type f | wc -l)
else
    BUILD_SIZE="N/A"
    ASSET_COUNT=0
fi

# Display results
echo -e "${CYAN}📊 Build Statistics:${NC}"
echo -e "  App:              $APP"
echo -e "  Build Type:       $BUILD_TYPE"
echo -e "  Started:          $START_DATE"
echo -e "  Completed:        $END_DATE"
echo ""
echo -e "${CYAN}⏱️  Timings:${NC}"
echo -e "  Dependencies:     ${DEPS_TIME}s"
echo -e "  Build:            ${BUILD_TIME}s"
echo -e "  ${GREEN}Total:            ${TOTAL_TIME}s${NC}"
echo ""
echo -e "${CYAN}📦 Output:${NC}"
echo -e "  Size:             $BUILD_SIZE"
echo -e "  Files:            $ASSET_COUNT"
echo ""

# Get git info
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Log to text file
cd ..
echo "$START_DATE | $APP | $BUILD_TYPE | Total: ${TOTAL_TIME}s | Build: ${BUILD_TIME}s | Deps: ${DEPS_TIME}s | Size: $BUILD_SIZE | Branch: $GIT_BRANCH" >> "$LOG_FILE"

# Log to JSON file
if [ ! -f "$JSON_LOG" ]; then
    echo "[]" > "$JSON_LOG"
fi

# Create JSON entry
JSON_ENTRY=$(cat <<EOF
{
  "timestamp": "$START_DATE",
  "app": "$APP",
  "buildType": "$BUILD_TYPE",
  "timings": {
    "total": $TOTAL_TIME,
    "build": $BUILD_TIME,
    "dependencies": $DEPS_TIME
  },
  "output": {
    "size": "$BUILD_SIZE",
    "fileCount": $ASSET_COUNT
  },
  "git": {
    "branch": "$GIT_BRANCH",
    "commit": "$GIT_COMMIT"
  }
}
EOF
)

# Append to JSON log (properly formatted array)
TEMP_JSON=$(mktemp)
jq ". += [$JSON_ENTRY]" "$JSON_LOG" > "$TEMP_JSON" 2>/dev/null || {
    # Fallback if jq not available
    echo "[$JSON_ENTRY]" > "$TEMP_JSON"
}
mv "$TEMP_JSON" "$JSON_LOG"

# Show recent builds
echo -e "${CYAN}📈 Recent Builds (last 5):${NC}"
tail -5 "$LOG_FILE" | while read line; do
    echo "  $line"
done
echo ""

# Calculate average build time
if command -v awk &> /dev/null; then
    AVG_TIME=$(grep "$APP" "$LOG_FILE" | tail -10 | awk -F'Total: |s' '{sum+=$2; count++} END {if(count>0) printf "%.1f", sum/count}')
    echo -e "${CYAN}📊 Average build time (last 10): ${GREEN}${AVG_TIME}s${NC}"
    echo ""
fi

# Performance tips
if [ $TOTAL_TIME -gt 300 ]; then
    echo -e "${YELLOW}⚠️  Build took longer than 5 minutes. Consider:${NC}"
    echo -e "  • Using build cache: npm run build:fast"
    echo -e "  • Cleaning node_modules: rm -rf node_modules && npm ci"
    echo -e "  • Checking disk space: df -h"
    echo ""
fi

# Success indicator
if [ $TOTAL_TIME -lt 180 ]; then
    echo -e "${GREEN}🚀 Fast build! (< 3 minutes)${NC}"
elif [ $TOTAL_TIME -lt 300 ]; then
    echo -e "${YELLOW}⚡ Good build time (< 5 minutes)${NC}"
else
    echo -e "${YELLOW}🐌 Slow build (> 5 minutes)${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Build tracking complete!${NC}"
echo -e "${CYAN}Logs saved to: $LOG_FILE and $JSON_LOG${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Return to original directory
exit 0
