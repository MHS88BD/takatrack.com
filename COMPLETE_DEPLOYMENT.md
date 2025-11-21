# 🚀 Complete Your Deployment - Step by Step

You're at: `/var/www/takatrack`

## Current Status
✅ PM2 daemon started
✅ Repository cloned
✅ Database created
⚠️  Need to complete setup

---

## Run These Commands in Order:

### 1. Fix Migrations and Setup Database
```bash
cd /var/www/takatrack

# Remove old SQLite migrations
rm -rf prisma/migrations

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push --accept-data-loss

# Seed database (optional - creates demo data)
npx prisma db seed
```

### 2. Build Backend
```bash
# Still in /var/www/takatrack
npm run build
```

### 3. Start Backend with PM2
```bash
# Start the application
pm2 start npm --name "takatrack-api" -- start

# Check status
pm2 status

# View logs
pm2 logs takatrack-api --lines 20
```

### 4. Build Frontend
```bash
cd /var/www/takatrack/client

# Install dependencies
npm install

# Build
npm run build

# Go back to root
cd ..
```

### 5. Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/takatracker.dupno.com
```

Paste this configuration:
```nginx
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
```

Save and exit (Ctrl+X, Y, Enter)

### 6. Enable Nginx Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/takatracker.dupno.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 7. Setup SSL (Optional but Recommended)
```bash
# Install Certbot if not installed
sudo apt-get install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d takatracker.dupno.com
```

### 8. Save PM2 Configuration
```bash
# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs
```

---

## Quick Verification

### Check Backend
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs takatrack-api

# Test API locally
curl http://localhost:3001/
```

### Check Frontend
```bash
# Check if build exists
ls -la /var/www/takatrack/client/dist

# Should see index.html and assets folder
```

### Check Nginx
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Access Your App

Once everything is running:

- **Frontend**: http://takatracker.dupno.com (or https:// if SSL is setup)
- **API**: http://takatracker.dupno.com/api/v1

---

## Troubleshooting

### If backend won't start:
```bash
# Check logs
pm2 logs takatrack-api

# Common issues:
# 1. Check .env file exists
cat /var/www/takatrack/.env

# 2. Check database connection
psql -U takatrack_user -d takatrack_db -h localhost

# 3. Restart PM2
pm2 restart takatrack-api
```

### If frontend shows blank page:
```bash
# Rebuild frontend
cd /var/www/takatrack/client
npm run build

# Check Nginx config
sudo nginx -t
```

### If database connection fails:
```bash
# Check if database exists
sudo -u postgres psql -l | grep takatrack

# Check .env DATABASE_URL
cat /var/www/takatrack/.env | grep DATABASE_URL
```

---

## All-in-One Quick Commands

If you want to run everything at once:

```bash
cd /var/www/takatrack && \
rm -rf prisma/migrations && \
npx prisma generate && \
npx prisma db push --accept-data-loss && \
npm run build && \
cd client && npm install && npm run build && cd .. && \
pm2 start npm --name "takatrack-api" -- start && \
pm2 save && \
echo "✅ Backend and Frontend ready!"
```

Then configure Nginx manually (steps 5-6 above).

---

**You're almost there! Just follow these steps and your app will be live!** 🚀
