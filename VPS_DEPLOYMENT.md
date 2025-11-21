# 🚀 VPS Deployment Guide - takatracker.dupno.com

## Server Information
- **IP**: 91.99.167.26
- **Domain**: takatracker.dupno.com
- **Existing Project**: mycard.dupno.com (Django + PostgreSQL)
- **New Project**: Taka Track (Node.js + React + PostgreSQL)

## Overview
This guide will deploy Taka Track alongside your existing Django project without any conflicts.

---

## 📋 Prerequisites

### On Your Local Machine
1. SSH access to the server
2. Git repository: https://github.com/MHS88BD/takatrack.com

### On the Server (will be installed)
- Node.js 18+
- PM2 (process manager)
- Nginx (already installed for Django)
- PostgreSQL (already installed)

---

## 🔧 Step-by-Step Deployment

### Step 1: Connect to Server

```bash
# From your local machine
ssh root@91.99.167.26
# Password: pscLamxiwUUE
```

### Step 2: Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x
```

### Step 3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 4: Create Database for Taka Track

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE takatrack_db;
CREATE USER takatrack_user WITH PASSWORD 'TakaTrack2025!SecurePass';
GRANT ALL PRIVILEGES ON DATABASE takatrack_db TO takatrack_user;
\q

# Exit postgres user
exit
```

### Step 5: Clone and Setup Application

```bash
# Create directory for the app
cd /var/www
sudo mkdir -p takatrack
sudo chown -R $USER:$USER takatrack
cd takatrack

# Clone repository
git clone https://github.com/MHS88BD/takatrack.com.git .

# Install backend dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Step 6: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following content:
```env
# Database
DATABASE_URL="postgresql://takatrack_user:TakaTrack2025!SecurePass@localhost:5432/takatrack_db?schema=public"

# JWT Secret (generate a strong one)
JWT_SECRET="your-super-secret-32-character-minimum-key-change-this-now"

# Environment
NODE_ENV=production

# Port (different from Django)
PORT=3001
```

Save and exit (Ctrl+X, Y, Enter)

### Step 7: Update Prisma Schema for PostgreSQL

```bash
# Edit prisma schema
nano prisma/schema.prisma
```

Change line 8 from:
```prisma
provider = "sqlite"
```

To:
```prisma
provider = "postgresql"
```

Save and exit.

### Step 8: Run Database Migrations

```bash
# Generate Prisma client with new schema
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Optional: Seed database with demo data
npx prisma db seed
```

### Step 9: Build Backend

```bash
# Build TypeScript
npm run build

# Test if it runs
npm start
# Press Ctrl+C to stop after verifying it starts
```

### Step 10: Setup Frontend

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create production environment file
nano .env.production
```

Add:
```env
VITE_API_URL=https://takatracker.dupno.com/api/v1
```

Save and exit.

```bash
# Build frontend
npm run build

# This creates a 'dist' folder with production files
```

### Step 11: Setup PM2 for Backend

```bash
# Go back to root directory
cd /var/www/takatrack

# Start backend with PM2
pm2 start npm --name "takatrack-api" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### Step 12: Configure Nginx

```bash
# Create Nginx configuration for Taka Track
sudo nano /etc/nginx/sites-available/takatracker.dupno.com
```

Add the following configuration:

```nginx
# Backend API
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

    # Frontend (React app)
    location / {
        root /var/www/takatrack/client/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

Save and exit.

### Step 13: Enable Nginx Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/takatracker.dupno.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

### Step 14: Setup SSL with Let's Encrypt

```bash
# Install Certbot (if not already installed)
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d takatracker.dupno.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)
```

### Step 15: Configure DNS

**On your domain provider (dupno.com):**

Add an A record:
```
Type: A
Name: takatracker
Value: 91.99.167.26
TTL: 3600
```

Wait 5-10 minutes for DNS propagation.

### Step 16: Verify Deployment

```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs takatrack-api

# Check Nginx status
sudo systemctl status nginx

# Test API endpoint
curl http://localhost:3001/
```

---

## 🔄 Update/Redeploy Script

Create a deployment script for easy updates:

```bash
# Create deployment script
nano /var/www/takatrack/deploy.sh
```

Add:
```bash
#!/bin/bash

echo "🚀 Deploying Taka Track..."

# Navigate to project directory
cd /var/www/takatrack

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Backend updates
echo "🔧 Updating backend..."
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# Frontend updates
echo "🎨 Updating frontend..."
cd client
npm install
npm run build
cd ..

# Restart backend
echo "🔄 Restarting backend..."
pm2 restart takatrack-api

# Reload Nginx
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌍 Visit: https://takatracker.dupno.com"
```

Make it executable:
```bash
chmod +x /var/www/takatrack/deploy.sh
```

---

## 📊 Port Allocation

To avoid conflicts with your Django project:

| Service | Port | Domain |
|---------|------|--------|
| Django (mycard) | 8000 (or current) | mycard.dupno.com |
| Taka Track API | 3001 | takatracker.dupno.com/api |
| Taka Track Frontend | Static files | takatracker.dupno.com |

---

## 🔍 Monitoring & Logs

```bash
# View backend logs
pm2 logs takatrack-api

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check PM2 status
pm2 status

# Check system resources
pm2 monit
```

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs takatrack-api

# Common issues:
# 1. Database connection - verify DATABASE_URL
# 2. Port conflict - ensure port 3001 is free
# 3. Missing dependencies - run npm install
```

### Frontend shows blank page
```bash
# Check if build exists
ls -la /var/www/takatrack/client/dist

# Rebuild frontend
cd /var/www/takatrack/client
npm run build

# Check Nginx configuration
sudo nginx -t
```

### Database connection error
```bash
# Test database connection
psql -U takatrack_user -d takatrack_db -h localhost

# If fails, check:
# 1. Database exists
# 2. User has permissions
# 3. DATABASE_URL is correct
```

### SSL certificate issues
```bash
# Renew certificate manually
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## 🔐 Security Checklist

- [x] Strong database password
- [x] Strong JWT secret (32+ characters)
- [x] SSL/HTTPS enabled
- [x] Firewall configured
- [x] .env file not in git
- [x] PM2 running as non-root (recommended)
- [x] Regular backups configured

---

## 📦 Backup Strategy

### Database Backup
```bash
# Create backup script
nano /var/www/takatrack/backup.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/takatrack"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U takatrack_user takatrack_db > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.sql"
```

Make executable and add to cron:
```bash
chmod +x /var/www/takatrack/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /var/www/takatrack/backup.sh
```

---

## ✅ Final Verification

After deployment, verify:

1. **Backend API**: https://takatracker.dupno.com/api/v1/
2. **Frontend**: https://takatracker.dupno.com
3. **SSL**: Check for green padlock
4. **Django Project**: https://mycard.dupno.com (should still work)

---

## 🎉 Success!

Your Taka Track application should now be live at:
**https://takatracker.dupno.com**

Both projects running on the same server:
- ✅ mycard.dupno.com (Django)
- ✅ takatracker.dupno.com (Taka Track)

---

**Last Updated**: November 21, 2025  
**Server**: 91.99.167.26  
**Status**: Ready for Deployment
