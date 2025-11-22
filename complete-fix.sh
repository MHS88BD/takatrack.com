#!/bin/bash

# Complete Fix Script for TakaTrack v3.0
# This script fixes all CSS, layout, and login issues

echo "🚀 Starting Complete Fix for TakaTrack v3.0..."

APP_DIR="/var/www/takatrack"
cd $APP_DIR

# 1. Pull Latest Code
echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main

# 2. Ensure .env file exists
echo "📝 Checking .env file..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="production"
PORT=3001
EOL
else
    # Make sure DATABASE_URL is set correctly
    if ! grep -q "DATABASE_URL" .env; then
        echo 'DATABASE_URL="file:./dev.db"' >> .env
    fi
fi

# 3. Fix Backend
echo "🔧 Rebuilding Backend..."
npm install
npx prisma generate
npx prisma db push --accept-data-loss
npm run build

# 4. Restart Backend
echo "🔄 Restarting Backend..."
pm2 restart takatrack-api

# 5. Clean Install Frontend
echo "🧹 Cleaning frontend completely..."
cd client
rm -rf dist node_modules package-lock.json .vite

# 5. Install Fresh Dependencies
echo "📦 Installing fresh dependencies..."
npm install

# 6. Build Frontend
echo "🏗️ Building frontend..."
npm run build

# 7. Verify Build
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist folder not created"
    exit 1
fi

echo "✅ Build successful!"

# 8. Fix Permissions
echo "🔐 Fixing permissions..."
cd $APP_DIR
chown -R root:root .
chmod -R 755 .

# 9. Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# 10. Show Status
echo ""
echo "✅ Complete Fix Finished!"
echo ""
echo "📊 Backend Status:"
pm2 status takatrack-api
echo ""
echo "🌐 Your app should now be live at: https://takatracker.dupno.com"
echo "👉 Clear your browser cache (Ctrl+Shift+R) and try again"
echo ""
echo "🔑 Demo Login: demo@example.com / demo123"
