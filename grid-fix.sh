#!/bin/bash

# Grid Layout Fix Script
# Implements CSS Grid to permanently fix sidebar overlap

echo "🏗️ Deploying Grid Layout Fix..."

cd /var/www/takatrack

# 1. Pull latest CSS changes
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main

# 2. Rebuild Frontend
echo "🎨 Rebuilding Frontend..."
cd client
rm -rf dist
export VITE_API_URL="/api/v1"
npm install
npm run build

echo ""
echo "✅ Grid Layout Deployed!"
echo "👉 Please clear your browser cache (Ctrl+Shift+R) to see the new layout."
