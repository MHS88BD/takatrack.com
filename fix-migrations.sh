#!/bin/bash

# Quick fix for Prisma migration provider mismatch
# Run this on your VPS server

echo "🔧 Fixing Prisma Migration Provider..."

cd /var/www/takatrack

# Backup existing migrations
if [ -d "prisma/migrations" ]; then
    echo "📦 Backing up old migrations..."
    mv prisma/migrations prisma/migrations_backup_$(date +%Y%m%d_%H%M%S)
fi

# Remove migration lock file
rm -f prisma/migrations/migration_lock.toml

# Update schema to PostgreSQL (if not already)
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Create new migration for PostgreSQL
echo "📝 Creating new PostgreSQL migration..."
npx prisma migrate deploy --create-only || npx prisma db push --accept-data-loss

# If that doesn't work, force push the schema
echo "🚀 Pushing schema to database..."
npx prisma db push --accept-data-loss

# Seed database (optional)
echo "🌱 Seeding database..."
npx prisma db seed || echo "No seed file or seeding failed"

echo "✅ Migration fixed!"
echo ""
echo "Next steps:"
echo "1. Build backend: npm run build"
echo "2. Restart PM2: pm2 restart takatrack-api"
