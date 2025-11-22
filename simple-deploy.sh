#!/bin/bash

# Simple SQLite Deployment - No PostgreSQL needed!

echo "🚀 Simple SQLite Deployment..."

cd /var/www/takatrack

# 1. Stop PM2
pm2 stop takatrack-api || true
pm2 delete takatrack-api || true

# 2. Pull latest code (SQLite version)
git fetch origin
git reset --hard origin/main

# 3. Create .env with SQLite (simple file-based database)
cat > .env << 'EOF'
DATABASE_URL=file:./dev.db
JWT_SECRET=takatrack-secret-2025
NODE_ENV=production
PORT=3001
EOF

echo "✅ .env created:"
cat .env
echo ""

# 4. Remove old node_modules
rm -rf node_modules

# 5. Install dependencies
npm install

# 6. Generate Prisma client for SQLite
npx prisma generate

# 7. Create/update SQLite database
npx prisma db push --accept-data-loss

# 8. Build backend
npm run build

# 9. Start with PM2
pm2 start dist/server.js --name takatrack-api
pm2 save

echo ""
echo "⏳ Waiting..."
sleep 3

echo "📊 Status:"
pm2 status

echo ""
echo "📝 Logs:"
pm2 logs takatrack-api --lines 15 --nostream

echo ""
echo "🧪 Testing:"
curl http://localhost:3001/

echo ""
echo "✅ Done! SQLite database created at: /var/www/takatrack/dev.db"
