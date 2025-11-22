#!/bin/bash

# Force Complete Rebuild with PostgreSQL

echo "🔥 FORCE REBUILD - PostgreSQL Edition"

cd /var/www/takatrack

# 1. Stop PM2
pm2 stop all
pm2 delete all

# 2. Create .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://takatrack_user:takatrack_pass@localhost:5432/takatrack_db?schema=public"
JWT_SECRET="takatrack-secret-2025"
NODE_ENV="production"
PORT=3001
EOF

# 3. Pull latest code
git fetch origin
git reset --hard origin/main

# 4. COMPLETELY remove node_modules and Prisma client
rm -rf node_modules
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# 5. Fresh install
npm install

# 6. Generate NEW Prisma client (with PostgreSQL)
npx prisma generate

# 7. Push schema to PostgreSQL
npx prisma db push --accept-data-loss

# 8. Build TypeScript
npm run build

# 9. Start PM2
pm2 start dist/server.js --name takatrack-api
pm2 save

echo ""
echo "⏳ Waiting 3 seconds..."
sleep 3

echo "📊 PM2 Status:"
pm2 status

echo ""
echo "📝 Logs:"
pm2 logs takatrack-api --lines 10 --nostream

echo ""
echo "🧪 Testing:"
curl http://localhost:3001/

echo ""
echo "✅ Done!"
