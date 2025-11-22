#!/bin/bash

# Simple Deployment Script for TakaTrack v3.0
# This script ensures everything is set up correctly

set -e  # Exit on any error

echo "🚀 Starting TakaTrack v3.0 Deployment..."

APP_DIR="/var/www/takatrack"
cd $APP_DIR

# 1. Pull Latest Code
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main

# 2. Create .env file (FORCE)
echo "📝 Creating .env file..."
cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
JWT_SECRET="takatrack-super-secret-jwt-key-2025-change-in-production"
NODE_ENV="production"
PORT=3001
EOF

echo "✅ .env file created:"
cat .env

# 3. Install Backend Dependencies
echo "📦 Installing backend dependencies..."
npm install

# 4. Generate Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate

# 5. Push Database Schema
echo "💾 Updating database schema..."
npx prisma db push --accept-data-loss --skip-generate

# 6. Build Backend
echo "🏗️ Building backend..."
npm run build

# 7. Restart Backend with PM2
echo "🔄 Restarting backend..."
pm2 restart takatrack-api || pm2 start dist/server.js --name takatrack-api

# 8. Build Frontend
echo "🎨 Building frontend..."
cd client

# Clean install
rm -rf dist node_modules package-lock.json

# Install dependencies
npm install

# Build
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# 9. Restart Nginx
echo "🌐 Restarting Nginx..."
cd $APP_DIR
sudo systemctl restart nginx

# 10. Show Status
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 Backend Status:"
pm2 status takatrack-api
echo ""
echo "🌐 Your app is live at: https://takatracker.dupno.com"
echo "🔑 Demo Login: demo@example.com / demo123"
echo ""
echo "📝 To view logs: pm2 logs takatrack-api"
