#!/bin/bash

# Takatracker Server Setup Script
# Run this script on a fresh Hetzner VPS (Ubuntu 22.04 LTS)

set -e  # Exit on error

echo "🚀 Setting up Takatracker server..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo -e "${YELLOW}📦 Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo -e "${YELLOW}🗄️  Installing PostgreSQL...${NC}"
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
sudo apt install -y nginx

# Install PM2 globally
echo -e "${YELLOW}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Install Git
echo -e "${YELLOW}📦 Installing Git...${NC}"
sudo apt install -y git

# Configure PostgreSQL
echo -e "${YELLOW}🗄️  Configuring PostgreSQL...${NC}"
sudo -u postgres psql <<EOF
CREATE DATABASE takatracker_db;
CREATE USER takatracker_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE takatracker_db TO takatracker_user;
ALTER DATABASE takatracker_db OWNER TO takatracker_user;
\q
EOF

# Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
sudo mkdir -p /var/www/takatracker
sudo chown -R $USER:$USER /var/www/takatracker

# Create logs directory
mkdir -p /var/www/takatracker/logs

# Clone repository (you'll need to update the URL)
echo -e "${YELLOW}📥 Cloning repository...${NC}"
echo "Please run: cd /var/www/takatracker && git clone YOUR_REPO_URL ."

# Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
echo "Nginx configuration will be copied from nginx.conf"
echo "Run: sudo cp nginx.conf /etc/nginx/sites-available/takatracker"
echo "Then: sudo ln -s /etc/nginx/sites-available/takatracker /etc/nginx/sites-enabled/"
echo "Then: sudo nginx -t && sudo systemctl restart nginx"

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Setup PM2 startup
echo -e "${YELLOW}🔄 Setting up PM2 startup...${NC}"
pm2 startup systemd -u $USER --hp /home/$USER
echo "After deploying the app, run: pm2 save"

# Create .env template
echo -e "${YELLOW}📝 Creating .env template...${NC}"
cat > /var/www/takatracker/.env.example <<EOF
# Database
DATABASE_URL="postgresql://takatracker_user:CHANGE_THIS_PASSWORD@localhost:5432/takatracker_db"

# JWT
JWT_SECRET="CHANGE_THIS_TO_RANDOM_STRING"
JWT_EXPIRES_IN="7d"

# Server
NODE_ENV="production"
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL="https://takatracker.com"
EOF

echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Clone your repository to /var/www/takatracker"
echo "2. Copy .env.example to .env and update the values"
echo "3. Run the deployment script: bash deploy.sh"
echo "4. Configure your domain DNS to point to this server"
echo "5. Install SSL certificate with: sudo certbot --nginx -d takatracker.com -d www.takatracker.com"
