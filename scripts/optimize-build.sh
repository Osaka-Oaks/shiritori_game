#!/bin/bash
# Build optimization script
# Analyzes and optimizes build performance

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Build Performance Optimizer${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to measure build time
measure_build() {
  local app=$1
  local start=$(date +%s)
  
  echo -e "${YELLOW}Building $app...${NC}"
  cd "$app"
  npm run build > /dev/null 2>&1
  cd ..
  
  local end=$(date +%s)
  local duration=$((end - start))
  echo -e "${GREEN}✅ $app built in ${duration}s${NC}"
  echo "$duration"
}

# Function to analyze bundle
analyze_bundle() {
  local app=$1
  echo -e "${YELLOW}Analyzing $app bundle...${NC}"
  
  if [ -d "$app/dist" ]; then
    local size=$(du -sh "$app/dist" | cut -f1)
    local files=$(find "$app/dist" -type f | wc -l | tr -d ' ')
    echo -e "${BLUE}  Size: $size${NC}"
    echo -e "${BLUE}  Files: $files${NC}"
    
    # Check for large files
    echo -e "${YELLOW}  Large files (>500KB):${NC}"
    find "$app/dist" -type f -size +500k -exec ls -lh {} \; | awk '{print "    " $9 " (" $5 ")"}'
  else
    echo -e "${RED}  No dist directory found${NC}"
  fi
}

# Function to check cache
check_cache() {
  echo -e "${YELLOW}Checking cache status...${NC}"
  
  if [ -d "node_modules/.cache" ]; then
    local cache_size=$(du -sh node_modules/.cache 2>/dev/null | cut -f1)
    echo -e "${BLUE}  Cache size: ${cache_size:-0}${NC}"
  else
    echo -e "${YELLOW}  No cache found${NC}"
  fi
}

# Function to suggest optimizations
suggest_optimizations() {
  echo ""
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}💡 Optimization Suggestions${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  # Check if using latest Vite
  echo -e "${YELLOW}1. Vite Version${NC}"
  if command -v npx &> /dev/null; then
    echo "   Current: $(npx vite --version 2>/dev/null || echo 'Not found')"
    echo "   Recommendation: Keep Vite updated for latest optimizations"
  fi
  
  # Check node_modules size
  echo -e "${YELLOW}2. Dependencies${NC}"
  if [ -d "node_modules" ]; then
    local nm_size=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "   node_modules size: ${nm_size}"
    echo "   Recommendation: Run 'npm dedupe' to reduce duplicates"
  fi
  
  # Check for TypeScript
  echo -e "${YELLOW}3. TypeScript${NC}"
  echo "   Recommendation: Use 'tsc --incremental' for faster type checking"
  
  # Check for ESLint cache
  echo -e "${YELLOW}4. ESLint Cache${NC}"
  if [ -f ".eslintcache" ]; then
    echo "   ✅ ESLint cache enabled"
  else
    echo "   Recommendation: Enable ESLint cache with --cache flag"
  fi
  
  # Check for Prettier cache
  echo -e "${YELLOW}5. Prettier Cache${NC}"
  echo "   Recommendation: Use --cache flag in CI for faster formatting checks"
}

# Main execution
echo -e "${BLUE}▸ Analyzing build performance...${NC}"
echo ""

# Measure builds
if [ -d "shiritori-online" ]; then
  ONLINE_TIME=$(measure_build "shiritori-online")
  analyze_bundle "shiritori-online"
  echo ""
fi

if [ -d "kawaii-shiritori" ]; then
  KAWAII_TIME=$(measure_build "kawaii-shiritori")
  analyze_bundle "kawaii-shiritori"
  echo ""
fi

# Check cache
check_cache
echo ""

# Suggest optimizations
suggest_optimizations

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 Build Performance Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
if [ -n "$ONLINE_TIME" ]; then
  echo -e "${GREEN}  shiritori-online: ${ONLINE_TIME}s${NC}"
fi
if [ -n "$KAWAII_TIME" ]; then
  echo -e "${GREEN}  kawaii-shiritori: ${KAWAII_TIME}s${NC}"
fi
if [ -n "$ONLINE_TIME" ] && [ -n "$KAWAII_TIME" ]; then
  TOTAL_TIME=$((ONLINE_TIME + KAWAII_TIME))
  echo -e "${BLUE}  Total build time: ${TOTAL_TIME}s${NC}"
fi
echo ""
echo -e "${GREEN}Run 'npm run optimize:deps' to reduce dependencies${NC}"
echo -e "${GREEN}Run 'npm dedupe' to remove duplicate packages${NC}"
echo ""
