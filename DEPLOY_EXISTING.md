# Safe Deployment Guide (Existing Server)

This guide is for deploying Takatracker to a server that **already hosts other applications** (like Django).

## ⚠️ Important Safety Checks

Before running anything, verify:
1. **Port 3000** is free (Takatracker uses this by default).
   ```bash
   sudo lsof -i :3000
   ```
2. **PostgreSQL** is running.
   ```bash
   systemctl status postgresql
   ```
3. **Nginx** is running.
   ```bash
   systemctl status nginx
   ```

## 🚀 Deployment Steps

### 1. Connect to Server
```bash
ssh root@91.99.167.26
```

### 2. Create Isolated Directory
```bash
mkdir -p /var/www/takatracker
cd /var/www/takatracker
```

### 3. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/takatracker.git .
```

### 4. Setup Database (Safe Mode)
Use the safe setup script that won't interfere with existing databases.
```bash
chmod +x setup-db-safe.sh
./setup-db-safe.sh
```
*Note: Edit the script first to set a secure password!*

### 5. Configure Environment
```bash
cp .env.example .env
nano .env
```
Update `DATABASE_URL` with the credentials from Step 4.

### 6. Install & Build
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

### 7. Run Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

### 8. Start Application (Isolated)
We use PM2 to run the app in isolation.
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 9. Configure Nginx (Non-Conflicting)
We will create a **separate** configuration file.

1. Copy the config:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/takatracker
   ```

2. Enable it:
   ```bash
   sudo ln -s /etc/nginx/sites-available/takatracker /etc/nginx/sites-enabled/
   ```

3. **Critical**: Test config before reloading!
   ```bash
   sudo nginx -t
   ```
   *If this says "syntax is ok", proceed. If not, STOP and fix errors.*

4. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```

## 🛡️ Isolation Features
- **Database**: Uses a dedicated user `takatracker_user` and DB `takatracker_db`.
- **Process**: Runs on port 3000 (separate from Django's likely 8000/8080).
- **Web Server**: Uses a specific `server_name takatracker.com` block, so it won't intercept other domains.
