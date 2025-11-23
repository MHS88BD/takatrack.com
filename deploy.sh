#!/bin/bash

# Takatracker Deployment Script
# This script deploys the application on Hetzner VPS

set -e  # Exit on error

echo "🚀 Starting Takatracker deployment..."

# Configuration
APP_DIR="/var/www/takatracker"
REPO_URL="https://github.com/YOUR_USERNAME/takatracker.git"  # Update this
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to app directory
cd $APP_DIR

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from Git...${NC}"
git pull origin $BRANCH

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
npm install --production

# Build backend
echo -e "${YELLOW}🔨 Building backend...${NC}"
npm run build

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy
npx prisma generate

# Build frontend
echo -e "${YELLOW}🎨 Building frontend...${NC}"
cd client
npm install
npm run build
cd ..

# Restart PM2
echo -e "${YELLOW}🔄 Restarting application...${NC}"
pm2 restart takatracker-api || pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is running at: http://takatracker.com${NC}"

# Show PM2 status
pm2 status
