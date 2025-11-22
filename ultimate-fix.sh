#!/bin/bash

# Ultimate Fix - Manually set environment variables

echo "🔧 Ultimate Backend Fix..."

cd /var/www/takatrack

# Stop everything
pm2 stop all
pm2 delete all

# Remove old .env
rm -f .env

# Create .env with explicit echo (no heredoc)
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'JWT_SECRET="takatrack-secret-2025"' >> .env
echo 'NODE_ENV="production"' >> .env
echo 'PORT=3001' >> .env

echo "📄 .env file contents:"
cat .env
echo ""

# Verify the file
echo "🔍 Checking .env format:"
file .env
echo ""

# Load .env and export variables manually
export $(cat .env | xargs)

echo "✅ Environment variables set:"
echo "DATABASE_URL=$DATABASE_URL"
echo "PORT=$PORT"
echo ""

# Generate Prisma client with explicit DATABASE_URL
echo "🔨 Generating Prisma client..."
DATABASE_URL="file:./dev.db" npx prisma generate

# Start with explicit environment variables
echo "🚀 Starting backend with explicit env vars..."
pm2 start dist/server.js \
  --name takatrack-api \
  --env production \
  -e DATABASE_URL="file:./dev.db" \
  -e JWT_SECRET="takatrack-secret-2025" \
  -e NODE_ENV="production" \
  -e PORT=3001

pm2 save

echo ""
echo "⏳ Waiting for backend to start..."
sleep 3

echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📝 Backend Logs:"
pm2 logs takatrack-api --lines 20 --nostream

echo ""
echo "🧪 Testing API..."
curl -X GET http://localhost:3001/ 2>&1

echo ""
echo "✅ Done!"
