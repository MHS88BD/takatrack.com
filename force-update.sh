#!/bin/bash

# Force Update Script for TakaTrack
# Run this on the VPS to fix UI issues

echo "🚀 Starting Force Update..."

APP_DIR="/var/www/takatrack"

cd $APP_DIR

# 1. Reset Git (Discard any local changes that might block pull)
echo "🔄 Resetting git..."
git fetch origin
git reset --hard origin/main

# 2. Clean Install Frontend
echo "🧹 Cleaning frontend..."
cd client
rm -rf dist node_modules package-lock.json
npm install
echo "🏗️ Building frontend..."
npm run build

# 3. Restart Nginx to clear any server-side caching
echo "restart nginx..."
sudo systemctl restart nginx

echo "✅ Force update complete!"
echo "👉 Please clear your browser cache (Ctrl+Shift+R) and check again."
