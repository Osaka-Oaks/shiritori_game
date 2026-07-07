#!/bin/bash
# Deploy with custom hashtags/labels for easy identification
# Usage: ./scripts/deploy-with-tags.sh [environment] [tags]
# Example: ./scripts/deploy-with-tags.sh production "#hotfix #security #critical"

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Deploy with Hashtags${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Parse arguments
ENV="${1:-production}"
CUSTOM_TAGS="${2:-}"

# Get current commit message
COMMIT_MSG=$(git log -1 --pretty=%B)

echo -e "${CYAN}Commit message:${NC}"
echo "$COMMIT_MSG"
echo ""

# Extract hashtags from commit message
COMMIT_HASHTAGS=$(echo "$COMMIT_MSG" | grep -o '#[a-zA-Z0-9_-]*' | tr '\n' ',' | sed 's/,$//')

# Combine tags
if [ -n "$CUSTOM_TAGS" ]; then
    ALL_TAGS="$CUSTOM_TAGS"
    if [ -n "$COMMIT_HASHTAGS" ]; then
        ALL_TAGS="$ALL_TAGS,$COMMIT_HASHTAGS"
    fi
else
    ALL_TAGS="$COMMIT_HASHTAGS"
fi

# Generate auto-tags
BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHA=$(git rev-parse --short HEAD)
DATE=$(date +%Y%m%d)

# Add auto-tags
ALL_TAGS="$ALL_TAGS,#branch:$BRANCH,#sha:$SHA,#date:$DATE,#env:$ENV"

echo -e "${CYAN}Environment:${NC} $ENV"
echo -e "${CYAN}Branch:${NC} $BRANCH"
echo -e "${CYAN}SHA:${NC} $SHA"
echo ""
echo -e "${CYAN}All tags:${NC}"
echo "$ALL_TAGS" | tr ',' '\n' | sed 's/^/  /'
echo ""

# Confirm
echo -e "${YELLOW}Ready to deploy with these tags?${NC}"
echo -e "${YELLOW}Press Enter to continue, Ctrl+C to cancel...${NC}"
read -r

# Trigger GitHub Actions workflow
echo -e "${BLUE}Triggering deployment workflow...${NC}"

if command -v gh &> /dev/null; then
    gh workflow run deploy-with-labels.yml \
        -f environment="$ENV" \
        -f tags="$ALL_TAGS"
    
    echo ""
    echo -e "${GREEN}✅ Deployment triggered!${NC}"
    echo ""
    echo -e "${CYAN}View progress:${NC}"
    echo "  gh run list --limit 5"
    echo "  gh run watch"
    echo ""
    echo -e "${CYAN}Or visit:${NC}"
    echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
else
    echo -e "${RED}❌ GitHub CLI (gh) not found${NC}"
    echo ""
    echo -e "${YELLOW}Install it or trigger manually:${NC}"
    echo "  Actions → Deploy & Test with Labels → Run workflow"
    echo ""
    echo -e "${YELLOW}Use these tags:${NC}"
    echo "$ALL_TAGS"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Deployment initiated with tags!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
