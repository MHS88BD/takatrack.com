#!/bin/bash

# Fix Server Script
# Runs a full rebuild of Backend and Frontend to resolve 500 Errors

echo "🛠️  Starting Server Fix..."

APP_DIR="/var/www/takatrack"
cd $APP_DIR

# 1. Fix Backend
echo "🔧 Fixing Backend..."
npm install
npx prisma generate
npm run build
pm2 restart takatrack-api

# 2. Fix Frontend
echo "🎨 Fixing Frontend..."
cd client
rm -rf dist node_modules
npm install
npm run build

# 3. Fix Permissions
echo "🔐 Fixing Permissions..."
cd $APP_DIR
chown -R root:root .
chmod -R 755 .

# 4. Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Fix Complete!"
echo "📊 Checking Backend Status:"
pm2 status takatrack-api
