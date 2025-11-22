#!/bin/bash

# Emergency Backend Fix Script
# Run this on the server to fix the backend

echo "🚨 Emergency Backend Fix..."

cd /var/www/takatrack

# 1. Create proper .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
DATABASE_URL="file:./dev.db"
JWT_SECRET="takatrack-jwt-secret-2025"
NODE_ENV="production"
PORT=3001
EOF

# 2. Stop PM2
echo "🛑 Stopping backend..."
pm2 stop takatrack-api || true
pm2 delete takatrack-api || true

# 3. Rebuild
echo "🔨 Rebuilding..."
npm run build

# 4. Start fresh
echo "🚀 Starting backend..."
pm2 start dist/server.js --name takatrack-api

# 5. Save PM2 config
pm2 save

# 6. Test
echo "🧪 Testing API..."
sleep 2
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

echo ""
echo "✅ Done! Check the output above."
echo "If you see a token, the API is working!"
