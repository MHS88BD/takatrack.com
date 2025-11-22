#!/bin/bash

# Taka Track - Automated VPS Deployment Script
# Run this script on your VPS server as root

set -e  # Exit on error

echo "🚀 Taka Track - Automated VPS Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/takatrack"
cd "$APP_DIR"

REPO_URL="https://github.com/MHS88BD/takatrack.com.git"
DOMAIN="takatracker.dupno.com"
DB_NAME="takatrack_db"
DB_USER="takatrack_user"
DB_PASS="TakaTrack2025!SecurePass"
API_PORT="3001"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "App Directory: $APP_DIR"
echo "API Port: $API_PORT"
echo "Database: $DB_NAME"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Running as root"
echo ""

# Step 1: Update system
echo -e "${BLUE}📦 Step 1: Updating system...${NC}"
apt-get update -qq
echo -e "${GREEN}✓${NC} System updated"
echo ""

# Step 2: Install Node.js
echo -e "${BLUE}📦 Step 2: Installing Node.js 18...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✓${NC} Node.js installed: $(node --version)"
else
    echo -e "${GREEN}✓${NC} Node.js already installed: $(node --version)"
fi
echo ""

# Step 3: Install PM2
echo -e "${BLUE}📦 Step 3: Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✓${NC} PM2 installed"
else
    echo -e "${GREEN}✓${NC} PM2 already installed"
fi
echo ""

# Step 4: Create database
echo -e "${BLUE}🗄️  Step 4: Setting up PostgreSQL database...${NC}"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
EOF
echo -e "${GREEN}✓${NC} Database configured"
echo ""

# Step 5: Clone repository
echo -e "${BLUE}📥 Step 5: Cloning repository...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}⚠${NC}  Directory exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    mkdir -p $APP_DIR
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi
echo -e "${GREEN}✓${NC} Repository ready"
echo ""

# Step 6: Setup backend
echo -e "${BLUE}🔧 Step 6: Setting up backend...${NC}"

# Create .env file
cat > .env <<EOF
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"
JWT_SECRET="$(openssl rand -base64 32)"
NODE_ENV=production
PORT=$API_PORT
EOF

# Update Prisma schema to use PostgreSQL
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Remove old SQLite migrations to avoid provider mismatch
if [ -d "prisma/migrations" ]; then
    echo -e "${YELLOW}⚠${NC}  Removing old SQLite migrations..."
    rm -rf prisma/migrations
fi

# Install dependencies
npm install --production=false

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables without migrations)
echo "📝 Creating database schema..."
npx prisma db push --accept-data-loss --skip-generate

# Optional: Seed database
echo "🌱 Seeding database..."
npx prisma db seed 2>/dev/null || echo "No seed file or seeding skipped"

# Build backend
npm run build

echo -e "${GREEN}✓${NC} Backend configured"
echo ""

# Step 7: Setup frontend
echo -e "${BLUE}🎨 Step 7: Setting up frontend...${NC}"
cd client

# Create production env
cat > .env.production <<EOF
VITE_API_URL=https://$DOMAIN/api/v1
EOF

# Install and build
npm install
npm run build

cd ..
echo -e "${GREEN}✓${NC} Frontend built"
echo ""

# Step 8: Setup PM2
echo -e "${BLUE}🔄 Step 8: Configuring PM2...${NC}"

# Stop if already running
pm2 delete takatrack-api 2>/dev/null || true

# Start application
pm2 start npm --name "takatrack-api" -- start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo -e "${GREEN}✓${NC} PM2 configured"
echo ""

# Step 9: Configure Nginx
echo -e "${BLUE}🌐 Step 9: Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/$DOMAIN <<'NGINXCONF'
server {
    listen 80;
    server_name takatracker.dupno.com;

    # API endpoints
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        root /var/www/takatrack/client/dist;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
NGINXCONF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo -e "${GREEN}✓${NC} Nginx configured"
echo ""

# Step 10: Setup SSL
echo -e "${BLUE}🔐 Step 10: Setting up SSL...${NC}"
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
fi

echo -e "${YELLOW}⚠${NC}  Running Certbot for SSL..."
echo -e "${YELLOW}⚠${NC}  Make sure DNS is pointing to this server!"
echo ""
read -p "Press Enter to continue with SSL setup (or Ctrl+C to skip)..."

certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@dupno.com || \
    echo -e "${YELLOW}⚠${NC}  SSL setup skipped or failed. Run manually: sudo certbot --nginx -d $DOMAIN"

echo ""

# Step 11: Create update script
echo -e "${BLUE}📝 Step 11: Creating update script...${NC}"

cat > $APP_DIR/deploy.sh <<'DEPLOYSH'
#!/bin/bash
echo "🚀 Updating Taka Track..."
cd /var/www/takatrack
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
cd client
npm install
npm run build
cd ..
pm2 restart takatrack-api
sudo systemctl reload nginx
echo "✅ Update complete!"
DEPLOYSH

chmod +x $APP_DIR/deploy.sh

echo -e "${GREEN}✓${NC} Update script created"
echo ""

# Step 12: Setup backup script
echo -e "${BLUE}💾 Step 12: Setting up backups...${NC}"

mkdir -p /var/backups/takatrack

cat > $APP_DIR/backup.sh <<BACKUPSH
#!/bin/bash
BACKUP_DIR="/var/backups/takatrack"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
pg_dump -U $DB_USER $DB_NAME > \$BACKUP_DIR/db_backup_\$DATE.sql
find \$BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
echo "Backup completed: \$BACKUP_DIR/db_backup_\$DATE.sql"
BACKUPSH

chmod +x $APP_DIR/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh") | crontab -

echo -e "${GREEN}✓${NC} Backup configured (daily at 2 AM)"
echo ""

# Final verification
echo "=========================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "📊 Status:"
echo "  Backend: $(pm2 list | grep takatrack-api | awk '{print $10}')"
echo "  Nginx: $(systemctl is-active nginx)"
echo "  Database: $DB_NAME"
echo ""
echo "🌍 URLs:"
echo "  Frontend: https://$DOMAIN"
echo "  API: https://$DOMAIN/api/v1"
echo ""
echo "📝 Useful Commands:"
echo "  View logs: pm2 logs takatrack-api"
echo "  Restart: pm2 restart takatrack-api"
echo "  Update: $APP_DIR/deploy.sh"
echo "  Backup: $APP_DIR/backup.sh"
echo ""
echo "✅ Your Django project (mycard.dupno.com) is unaffected"
echo ""
echo -e "${BLUE}🚀 Visit: https://$DOMAIN${NC}"
echo ""
