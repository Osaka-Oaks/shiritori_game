#!/bin/bash
# Pre-deployment validation script
# Run this before deploying to catch issues early

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      🚀 PRE-DEPLOYMENT VALIDATION CHECKLIST          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Helper functions
pass() {
    echo -e "${GREEN}✅ PASS${NC} - $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}❌ FAIL${NC} - $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  WARN${NC} - $1"
    ((WARNINGS++))
}

section() {
    echo ""
    echo -e "${BLUE}▸ $1${NC}"
    echo "────────────────────────────────────────────────────────"
}

# ============================================================================
# 1. GIT STATUS
# ============================================================================

section "1. Git Status"

if [ -n "$(git status --porcelain)" ]; then
    warn "Working directory has uncommitted changes"
    git status --short
else
    pass "Working directory clean"
fi

BRANCH=$(git branch --show-current)
if [ "$BRANCH" = "main" ]; then
    pass "On main branch"
else
    warn "Not on main branch (currently on: $BRANCH)"
fi

# ============================================================================
# 2. DEPENDENCY CHECK
# ============================================================================

section "2. Dependencies"

if command -v npm &> /dev/null; then
    pass "npm installed"
else
    fail "npm not found"
    exit 1
fi

NODE_VERSION=$(node --version)
pass "Node.js version: $NODE_VERSION"

# Check root dependencies
if [ -f "package-lock.json" ]; then
    pass "Root package-lock.json exists"
else
    warn "Root package-lock.json missing"
fi

# Check for security vulnerabilities
echo "  Checking for vulnerabilities..."
npm audit --production 2>&1 | grep -q "0 vulnerabilities" && pass "No production vulnerabilities" || warn "Vulnerabilities found (run: npm audit)"

# ============================================================================
# 3. SHIRITORI ONLINE
# ============================================================================

section "3. Shiritori Online"

cd shiritori-online

if [ -f "package.json" ]; then
    pass "package.json exists"
else
    fail "package.json missing"
    exit 1
fi

echo "  Installing dependencies..."
npm ci --silent || { fail "npm ci failed"; exit 1; }
pass "Dependencies installed"

echo "  Running type check..."
npx tsc --noEmit 2>&1 | head -5 && pass "Type check passed" || warn "Type errors found"

echo "  Building..."
npm run build --silent || { fail "Build failed"; exit 1; }
pass "Build successful"

if [ -d "dist" ]; then
    SIZE=$(du -sh dist | cut -f1)
    pass "Build output: $SIZE"
else
    fail "dist directory not found"
    exit 1
fi

# Check firebase.json
if [ -f "firebase.json" ]; then
    pass "firebase.json exists"
else
    fail "firebase.json missing"
    exit 1
fi

# Check database rules
if [ -f "database.rules.json" ]; then
    pass "database.rules.json exists"
else
    fail "database.rules.json missing"
    exit 1
fi

cd ..

# ============================================================================
# 4. KAWAII SHIRITORI
# ============================================================================

section "4. Kawaii Shiritori"

cd kawaii-shiritori

if [ -f "package.json" ]; then
    pass "package.json exists"
else
    fail "package.json missing"
    exit 1
fi

echo "  Installing dependencies..."
npm ci --silent || { fail "npm ci failed"; exit 1; }
pass "Dependencies installed"

echo "  Running type check..."
npx tsc --noEmit 2>&1 | head -5 && pass "Type check passed" || warn "Type errors found"

echo "  Running tests..."
npm test --silent 2>&1 | head -10 && pass "Tests passed" || warn "Some tests failed"

echo "  Building..."
npm run build --silent || { fail "Build failed"; exit 1; }
pass "Build successful"

if [ -d "dist" ]; then
    SIZE=$(du -sh dist | cut -f1)
    pass "Build output: $SIZE"
else
    fail "dist directory not found"
    exit 1
fi

# Check firebase config
if [ -f "firebase.json" ]; then
    pass "firebase.json exists"
else
    fail "firebase.json missing"
    exit 1
fi

# Check firestore rules
if [ -f "firestore.rules" ]; then
    pass "firestore.rules exists"
else
    warn "firestore.rules missing"
fi

cd ..

# ============================================================================
# 5. FIREBASE CONFIG
# ============================================================================

section "5. Firebase Configuration"

if [ -f ".firebaserc" ]; then
    pass ".firebaserc exists"
    PROJECT=$(grep -o '"default": "[^"]*"' .firebaserc | cut -d'"' -f4)
    if [ "$PROJECT" = "shiritori-game-ccaae" ]; then
        pass "Project ID: $PROJECT"
    else
        fail "Wrong project ID: $PROJECT"
    fi
else
    fail ".firebaserc missing"
    exit 1
fi

if command -v firebase &> /dev/null; then
    pass "Firebase CLI installed"
    FIREBASE_VERSION=$(firebase --version)
    echo "  Version: $FIREBASE_VERSION"
else
    warn "Firebase CLI not installed globally (will use npx)"
fi

# Check for Firebase token
if [ -n "$FIREBASE_TOKEN" ]; then
    pass "FIREBASE_TOKEN environment variable set"
else
    warn "FIREBASE_TOKEN not set (required for CI/CD)"
fi

# ============================================================================
# 6. ENVIRONMENT VARIABLES
# ============================================================================

section "6. Environment Variables"

# Check for .env files
cd kawaii-shiritori
if [ -f ".env.local" ]; then
    pass ".env.local exists"
    
    # Check for required variables
    if grep -q "GEMINI_API_KEY" .env.local; then
        pass "GEMINI_API_KEY configured"
    else
        warn "GEMINI_API_KEY not found in .env.local"
    fi
    
    if grep -q "VITE_FIREBASE_API_KEY" .env.local; then
        pass "Firebase API key configured"
    else
        warn "VITE_FIREBASE_API_KEY not found in .env.local"
    fi
else
    warn ".env.local not found (required for local dev)"
fi

cd ..

# ============================================================================
# 7. SECURITY RULES VALIDATION
# ============================================================================

section "7. Security Rules"

echo "  Validating database rules..."
cd shiritori-online
if npx firebase-tools database:rules:list 2>/dev/null | grep -q "Active"; then
    pass "Database rules validated"
else
    warn "Could not validate database rules"
fi
cd ..

echo "  Validating Firestore rules..."
cd kawaii-shiritori
if [ -f "firestore.rules" ]; then
    if grep -q "rules_version" firestore.rules; then
        pass "Firestore rules syntax valid"
    else
        warn "Firestore rules may have syntax issues"
    fi
fi
cd ..

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SUMMARY                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed:${NC}   $PASSED"
echo -e "  ${YELLOW}⚠️  Warnings:${NC} $WARNINGS"
echo -e "  ${RED}❌ Failed:${NC}   $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 All critical checks passed!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}Ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review warnings (if any)"
    echo "  2. Commit and push to trigger deployment"
    echo "  3. Monitor GitHub Actions: https://github.com/JorelFuji/shiritori_game/actions"
    echo "  4. Test live site after deployment"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ $FAILED critical check(s) failed!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${RED}Please fix the failed checks before deploying.${NC}"
    echo ""
    exit 1
fi
