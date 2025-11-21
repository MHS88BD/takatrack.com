#!/bin/bash

# Taka Track - Deployment Verification Script
# This script verifies that your project is ready for deployment

echo "🚀 Taka Track - Deployment Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

echo "📋 Checking Prerequisites..."
echo ""

# Check Node.js
node --version > /dev/null 2>&1
check "Node.js installed"

# Check npm
npm --version > /dev/null 2>&1
check "npm installed"

# Check Git
git --version > /dev/null 2>&1
check "Git installed"

echo ""
echo "📦 Checking Project Files..."
echo ""

# Check package.json
[ -f "package.json" ]
check "Backend package.json exists"

# Check client package.json
[ -f "client/package.json" ]
check "Frontend package.json exists"

# Check Prisma schema
[ -f "prisma/schema.prisma" ]
check "Prisma schema exists"

# Check environment example
[ -f ".env.example" ]
check ".env.example exists"

# Check deployment configs
[ -f "railway.json" ]
check "Railway config exists"

[ -f "render.yaml" ]
check "Render config exists"

[ -f "Procfile" ]
check "Procfile exists"

[ -f "client/vercel.json" ]
check "Vercel config exists"

echo ""
echo "🔨 Testing Builds..."
echo ""

# Test backend build
echo "Building backend..."
npm install > /dev/null 2>&1 && npx prisma generate > /dev/null 2>&1 && npm run build > /dev/null 2>&1
check "Backend builds successfully"

# Test frontend build
echo "Building frontend..."
cd client && npm install > /dev/null 2>&1 && npm run build > /dev/null 2>&1
check "Frontend builds successfully"
cd ..

echo ""
echo "📝 Checking Documentation..."
echo ""

# Check documentation files
[ -f "README.md" ]
check "README.md exists"

[ -f "DEPLOY_FROM_GITHUB.md" ]
check "DEPLOY_FROM_GITHUB.md exists"

[ -f "DEPLOYMENT_CHECKLIST.md" ]
check "DEPLOYMENT_CHECKLIST.md exists"

[ -f "LICENSE" ]
check "LICENSE exists"

echo ""
echo "🔐 Checking Security..."
echo ""

# Check .gitignore
[ -f ".gitignore" ]
check ".gitignore exists"

# Check if .env is in .gitignore
grep -q "^\.env$" .gitignore
check ".env is in .gitignore"

# Check if node_modules is in .gitignore
grep -q "node_modules" .gitignore
check "node_modules is in .gitignore"

# Check if .env exists (should not be committed)
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file exists (make sure it's not committed)"
else
    echo -e "${GREEN}✓${NC} .env file not present (good for deployment)"
    ((PASSED++))
fi

echo ""
echo "🌐 Checking Git Repository..."
echo ""

# Check if git is initialized
[ -d ".git" ]
check "Git repository initialized"

# Check remote
git remote -v | grep -q "github.com/MHS88BD/takatrack.com"
check "GitHub remote configured"

# Check if on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
    echo -e "${GREEN}✓${NC} On main branch"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Not on main branch (current: $BRANCH)"
fi

echo ""
echo "========================================"
echo "📊 Verification Results"
echo "========================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Your project is ready for deployment!${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Follow DEPLOY_FROM_GITHUB.md for deployment"
    echo "3. Choose your platform: Railway, Render, or Vercel"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi
