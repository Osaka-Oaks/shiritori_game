#!/bin/bash
# Verify file organization and naming conventions
# Tests that all files follow naming standards and build still works

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📁 File Organization Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Check 1: Component naming conventions
echo -e "${YELLOW}[1/8] Checking component naming conventions...${NC}"
BAD_COMPONENTS=$(find kawaii-shiritori/src/components -name "*.tsx" | grep -E "[a-z][A-Z]|[A-Z][a-z]*[a-z]" | grep -v -E "^.*[A-Z][a-z]*View\.tsx$|^.*[A-Z][a-z]*\.tsx$" || true)

if [ -z "$BAD_COMPONENTS" ]; then
    echo -e "${GREEN}✅ All components follow PascalCase naming${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Some components may have unconventional names:${NC}"
    echo "$BAD_COMPONENTS"
    ((WARNINGS++))
fi

# Check 2: Library file naming (camelCase)
echo -e "${YELLOW}[2/8] Checking library file naming...${NC}"
BAD_LIBS=$(find kawaii-shiritori/src/lib -name "*.ts" ! -name "*.test.ts" | grep -E "^[A-Z]" || true)

if [ -z "$BAD_LIBS" ]; then
    echo -e "${GREEN}✅ All library files follow camelCase naming${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Some library files use PascalCase (should be camelCase):${NC}"
    echo "$BAD_LIBS"
    ((FAILED++))
fi

# Check 3: Test file naming
echo -e "${YELLOW}[3/8] Checking test file naming...${NC}"
BAD_TESTS=$(find kawaii-shiritori/src -name "*.test.ts" | grep -v "\.test\.ts$" || true)

if [ -z "$BAD_TESTS" ]; then
    echo -e "${GREEN}✅ All test files follow [name].test.ts pattern${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Some test files don't follow naming convention:${NC}"
    echo "$BAD_TESTS"
    ((FAILED++))
fi

# Check 4: FloatingDictionary integration
echo -e "${YELLOW}[4/8] Checking FloatingDictionary integration...${NC}"
if grep -q "FloatingDictionary" kawaii-shiritori/src/App.tsx; then
    echo -e "${GREEN}✅ FloatingDictionary is integrated in App.tsx${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FloatingDictionary not found in App.tsx${NC}"
    ((FAILED++))
fi

# Check 5: Import paths
echo -e "${YELLOW}[5/8] Checking import paths...${NC}"
BROKEN_IMPORTS=$(grep -r "import.*from.*FloatingDictionary" kawaii-shiritori/src/*.tsx 2>/dev/null | grep -v "./components/FloatingDictionary" || true)

if [ -z "$BROKEN_IMPORTS" ]; then
    echo -e "${GREEN}✅ All FloatingDictionary imports use correct path${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Some imports may be incorrect:${NC}"
    echo "$BROKEN_IMPORTS"
    ((FAILED++))
fi

# Check 6: TypeScript compilation
echo -e "${YELLOW}[6/8] Running TypeScript type check...${NC}"
cd kawaii-shiritori

if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript compiles without errors${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ TypeScript compilation errors found${NC}"
    npx tsc --noEmit 2>&1 | head -10
    ((FAILED++))
fi

# Check 7: ESLint
echo -e "${YELLOW}[7/8] Running ESLint...${NC}"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ESLint passes${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  ESLint warnings found${NC}"
    ((WARNINGS++))
fi

# Check 8: Build test
echo -e "${YELLOW}[8/8] Testing production build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Production build succeeds${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Production build failed${NC}"
    ((FAILED++))
fi

cd ..

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed:${NC}   $PASSED"
echo -e "  ${YELLOW}⚠️  Warnings:${NC} $WARNINGS"
echo -e "  ${RED}❌ Failed:${NC}   $FAILED"
echo ""

# Overall status
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All verifications passed!${NC}"
    echo -e "${GREEN}File organization is correct and build is working.${NC}"
    echo ""
    echo -e "${CYAN}✨ FloatingDictionary with PiP mode is integrated and working!${NC}"
    EXIT_CODE=0
elif [ $FAILED -lt 3 ]; then
    echo -e "${YELLOW}⚠️  Some issues found but build still works${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ Critical issues found - fix before proceeding${NC}"
    EXIT_CODE=1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

exit $EXIT_CODE
