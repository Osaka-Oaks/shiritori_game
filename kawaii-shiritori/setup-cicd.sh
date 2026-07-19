#!/bin/bash

echo "🚀 Setting up CI/CD for Shiritori Game..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}🔧 Setting up Husky...${NC}"
npm run prepare

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to setup Husky${NC}"
    exit 1
fi

# Create pre-commit hook
echo -e "${BLUE}📝 Creating pre-commit hook...${NC}"
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."
npx lint-staged
EOF

chmod +x .husky/pre-commit

echo -e "${GREEN}✅ Husky configured${NC}"
echo ""

# Create commit-msg hook for conventional commits
echo -e "${BLUE}📝 Creating commit-msg hook...${NC}"
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check if commit message follows conventional commits
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "❌ Commit message does not follow conventional commits format"
    echo ""
    echo "Format: <type>(<scope>): <subject>"
    echo ""
    echo "Example: feat(game): add 2D mode"
    echo "         fix(leaderboard): resolve sorting issue"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
    exit 1
fi
EOF

chmod +x .husky/commit-msg

echo -e "${GREEN}✅ Commit message validation configured${NC}"
echo ""

# Run initial validation
echo -e "${BLUE}🧪 Running initial validation...${NC}"
echo ""

echo -e "${BLUE}1. Type checking...${NC}"
npm run type-check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${RED}⚠️  Type check has warnings${NC}"
fi
echo ""

echo -e "${BLUE}2. Linting...${NC}"
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${RED}⚠️  Linting has issues${NC}"
fi
echo ""

echo -e "${BLUE}3. Format checking...${NC}"
npm run format:check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Format check passed${NC}"
else
    echo -e "${RED}⚠️  Some files need formatting${NC}"
    echo -e "${BLUE}Run 'npm run format' to fix${NC}"
fi
echo ""

echo -e "${BLUE}4. Running tests...${NC}"
npm run test
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
fi
echo ""

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ CI/CD Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Set up GitHub Secrets (see CICD_SETUP_GUIDE.md)"
echo "   - FIREBASE_SERVICE_ACCOUNT"
echo "   - FIREBASE_TOKEN"
echo "   - FIREBASE_PROJECT_ID"
echo ""
echo "2. Push to GitHub to trigger CI workflow"
echo "   $ git add ."
echo "   $ git commit -m \"ci: setup GitHub Actions\""
echo "   $ git push"
echo ""
echo "3. Check Actions tab on GitHub for workflow runs"
echo ""
echo "📚 Documentation:"
echo "   - CICD_SETUP_GUIDE.md - Complete setup guide"
echo "   - DEPLOYMENT_GUIDE.md - Firebase deployment"
echo "   - QUICK_DEPLOY.md - Quick start guide"
echo ""
echo "🎮 New Features:"
echo "   - 2D Game Mode (src/components/Game2D.tsx)"
echo "   - Leaderboard System (src/lib/leaderboard.ts)"
echo "   - ON-YOMI Readings in dictionary"
echo ""
echo "Happy coding! 🚀"
echo ""
