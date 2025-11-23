# Takatracker Deployment Guide

## Server Information
- **Domain**: takatracker.com
- **Server IP**: 91.99.167.26
- **Server**: Hetzner VPS
- **OS**: Ubuntu 22.04 LTS (recommended)

## Prerequisites
- Domain `takatracker.com` pointed to `91.99.167.26` via Cloudflare
- SSH access to the server
- Git repository set up (GitHub, GitLab, etc.)

## Initial Server Setup

### 1. Connect to Server
```bash
ssh root@91.99.167.26
# Password: pscLamxiwUUE
```

### 2. Create Application Directory
```bash
mkdir -p /var/www/takatracker
cd /var/www/takatracker
```

> [!NOTE]
> **Optional**: Create a non-root user for better security
> ```bash
> adduser takatracker
> usermod -aG sudo takatracker
> chown -R takatracker:takatracker /var/www/takatracker
> su - takatracker
> ```
> If you create a non-root user, run all subsequent commands as that user.

### 3. Run Server Setup Script
```bash
# Upload setup-server.sh to the server or download it
chmod +x setup-server.sh
./setup-server.sh
```

This script will install:
- Node.js 20.x
- PostgreSQL
- Nginx
- PM2
- Git

### 4. Configure Database
The setup script creates a PostgreSQL database. Update the password:
```bash
sudo -u postgres psql
ALTER USER takatracker_user WITH PASSWORD 'YOUR_SECURE_PASSWORD';
\q
```

## Application Deployment

### 1. Clone Repository
```bash
cd /var/www/takatracker
git clone YOUR_REPOSITORY_URL .
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

Update the following:
```env
DATABASE_URL="postgresql://takatracker_user:YOUR_SECURE_PASSWORD@localhost:5432/takatracker_db"
JWT_SECRET="GENERATE_RANDOM_STRING_HERE"
NODE_ENV="production"
PORT=3000
FRONTEND_URL="https://takatracker.com"
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Install Dependencies and Build
```bash
# Backend
npm install --production
npm run build

# Frontend
cd client
npm install
npm run build
cd ..
```

### 4. Run Database Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

### 6. Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/takatracker
sudo ln -s /etc/nginx/sites-available/takatracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Configure SSL with Certbot (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d takatracker.com -d www.takatracker.com
```

## Cloudflare Configuration

### DNS Settings
1. Go to Cloudflare Dashboard
2. Select your domain `takatracker.com`
3. Go to DNS settings
4. Add/Update A records:
   - Type: A
   - Name: @
   - IPv4 address: 91.99.167.26
   - Proxy status: Proxied (orange cloud)
   
   - Type: A
   - Name: www
   - IPv4 address: 91.99.167.26
   - Proxy status: Proxied (orange cloud)

### SSL/TLS Settings
1. Go to SSL/TLS → Overview
2. Set encryption mode to "Full" or "Full (strict)"

### Firewall Rules (Optional)
- Allow all traffic or configure custom rules as needed

## Updating the Application

### Using the Deployment Script
```bash
cd /var/www/takatracker
bash deploy.sh
```

### Manual Update
```bash
cd /var/www/takatracker
git pull origin main
npm install --production
npm run build
cd client
npm install
npm run build
cd ..
npx prisma migrate deploy
pm2 restart takatracker-api
```

## Password Reset Flow

### For Administrators
When a user requests a password reset:

1. User clicks "Forgot Password" on login page
2. User enters email or phone number
3. System logs reset token to server console
4. Administrator checks server logs:
   ```bash
   pm2 logs takatracker-api
   ```
5. Administrator provides the reset token to the user
6. User enters token and new password
7. Password is reset successfully

### Viewing Logs
```bash
# Real-time logs
pm2 logs takatracker-api

# Log files
tail -f /var/www/takatracker/logs/out.log
tail -f /var/www/takatracker/logs/err.log
```

## Monitoring

### Check Application Status
```bash
pm2 status
pm2 monit
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t  # Test configuration
```

### Check PostgreSQL Status
```bash
sudo systemctl status postgresql
```

### View Application Logs
```bash
pm2 logs takatracker-api --lines 100
```

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs takatracker-api

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart takatracker-api
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -U takatracker_user -d takatracker_db -h localhost
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/takatracker_error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Domain Not Resolving
1. Check DNS propagation: https://dnschecker.org
2. Verify Cloudflare DNS settings
3. Check Nginx configuration
4. Verify firewall allows ports 80 and 443

## Security Checklist

- [ ] Strong PostgreSQL password set
- [ ] Secure JWT secret generated
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Regular backups configured
- [ ] Non-root user created
- [ ] SSH key authentication enabled (recommended)
- [ ] Fail2ban installed (recommended)

## Backup Strategy

### Database Backup
```bash
# Create backup
pg_dump -U takatracker_user takatracker_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U takatracker_user takatracker_db < backup_20240101.sql
```

### Automated Backups (Cron)
```bash
crontab -e
# Add: 0 2 * * * pg_dump -U takatracker_user takatracker_db > /backups/db_$(date +\%Y\%m\%d).sql
```

## Support

For issues or questions:
1. Check application logs: `pm2 logs`
2. Check Nginx logs: `/var/log/nginx/takatracker_error.log`
3. Check PostgreSQL logs: `/var/log/postgresql/`

## Quick Reference Commands

```bash
# Application
pm2 restart takatracker-api
pm2 logs takatracker-api
pm2 monit

# Nginx
sudo systemctl restart nginx
sudo nginx -t

# PostgreSQL
sudo systemctl restart postgresql
psql -U takatracker_user -d takatracker_db

# Deployment
cd /var/www/takatracker && bash deploy.sh
```
