#!/bin/bash

# PostgreSQL Fix Script for TakaTrack
# This uses the correct PostgreSQL database

echo "🔧 Fixing TakaTrack with PostgreSQL..."

cd /var/www/takatrack

# 1. Create .env with PostgreSQL connection
echo "📝 Creating .env with PostgreSQL..."
cat > .env << 'EOF'
DATABASE_URL="postgresql://takatrack_user:takatrack_pass@localhost:5432/takatrack_db?schema=public"
JWT_SECRET="takatrack-secret-2025"
NODE_ENV="production"
PORT=3001
EOF

echo "✅ .env created:"
cat .env
echo ""

# 2. Pull latest code (with PostgreSQL schema)
echo "📥 Pulling latest code..."
git pull origin main

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Generate Prisma Client
echo "🔨 Generating Prisma client..."
npx prisma generate

# 5. Push database schema
echo "💾 Pushing database schema..."
npx prisma db push --accept-data-loss

# 6. Build backend
echo "🏗️ Building backend..."
npm run build

# 7. Restart with PM2
echo "🔄 Restarting backend..."
pm2 stop takatrack-api || true
pm2 delete takatrack-api || true
pm2 start dist/server.js --name takatrack-api
pm2 save

# 8. Wait and test
echo "⏳ Waiting for backend..."
sleep 3

echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🧪 Testing API..."
curl http://localhost:3001/

echo ""
echo "✅ Done! Backend should be running with PostgreSQL"
