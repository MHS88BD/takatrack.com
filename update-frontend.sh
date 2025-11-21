#!/bin/bash

# Quick update script for VPS deployment
# Run this on your VPS server to update the frontend

echo "🔄 Updating Taka Track Frontend..."

cd /var/www/takatrack

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install any new dependencies
echo "📦 Installing dependencies..."
cd client
npm install

# Rebuild frontend
echo "🔨 Building frontend..."
npm run build

# Restart Nginx (optional, usually not needed for static files)
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Frontend updated successfully!"
echo "🌍 Visit: https://takatracker.dupno.com"
