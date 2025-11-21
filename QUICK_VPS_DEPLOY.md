# 🚀 Quick VPS Deployment - takatracker.dupno.com

## One-Command Deployment

### Step 1: SSH into Your Server
```bash
ssh root@91.99.167.26
# Password: pscLamxiwUUE
```

### Step 2: Run Automated Deployment
```bash
# Download and run the deployment script
curl -o- https://raw.githubusercontent.com/MHS88BD/takatrack.com/main/vps-deploy.sh | bash
```

**OR** manually:

```bash
# Clone repository
cd /tmp
git clone https://github.com/MHS88BD/takatrack.com.git
cd takatrack.com

# Run deployment script
chmod +x vps-deploy.sh
./vps-deploy.sh
```

### Step 3: Configure DNS (While Script Runs)

On your domain provider (dupno.com), add:
```
Type: A
Name: takatracker
Value: 91.99.167.26
TTL: 3600
```

### Step 4: Wait for Completion

The script will:
- ✅ Install Node.js 18
- ✅ Install PM2
- ✅ Create PostgreSQL database
- ✅ Clone your repository
- ✅ Setup backend (.env, Prisma, build)
- ✅ Setup frontend (build React app)
- ✅ Configure PM2 (process manager)
- ✅ Configure Nginx (web server)
- ✅ Setup SSL with Let's Encrypt
- ✅ Create update script
- ✅ Setup daily backups

**Total time**: ~5-10 minutes

---

## What Gets Deployed

### Backend API
- **URL**: https://takatracker.dupno.com/api/v1
- **Port**: 3001 (internal)
- **Process Manager**: PM2
- **Database**: PostgreSQL (takatrack_db)

### Frontend
- **URL**: https://takatracker.dupno.com
- **Location**: /var/www/takatrack/client/dist
- **Server**: Nginx (static files)

### Existing Project (Unaffected)
- **URL**: https://mycard.dupno.com
- **Status**: ✅ Continues running normally

---

## After Deployment

### Verify Everything Works
```bash
# Check backend status
pm2 status

# View backend logs
pm2 logs takatrack-api

# Check Nginx
sudo systemctl status nginx

# Test API
curl http://localhost:3001/
```

### Access Your App
1. **Frontend**: https://takatracker.dupno.com
2. **API**: https://takatracker.dupno.com/api/v1

---

## Common Tasks

### Update Application
```bash
cd /var/www/takatrack
./deploy.sh
```

### View Logs
```bash
# Backend logs
pm2 logs takatrack-api

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Backend
```bash
pm2 restart takatrack-api
```

### Backup Database
```bash
cd /var/www/takatrack
./backup.sh
```

### Check Database
```bash
psql -U takatrack_user -d takatrack_db
```

---

## Troubleshooting

### If deployment fails:

1. **Check logs**:
   ```bash
   pm2 logs takatrack-api
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verify database**:
   ```bash
   sudo -u postgres psql -l | grep takatrack
   ```

3. **Check Nginx config**:
   ```bash
   sudo nginx -t
   ```

4. **Restart services**:
   ```bash
   pm2 restart takatrack-api
   sudo systemctl restart nginx
   ```

### If SSL fails:

```bash
# Make sure DNS is pointing to server
dig takatracker.dupno.com

# Run Certbot manually
sudo certbot --nginx -d takatracker.dupno.com
```

---

## File Locations

```
/var/www/takatrack/          # Application root
├── src/                     # Backend source
├── client/dist/             # Frontend build
├── .env                     # Environment variables
├── deploy.sh                # Update script
└── backup.sh                # Backup script

/var/backups/takatrack/      # Database backups
/etc/nginx/sites-available/  # Nginx config
/var/log/nginx/              # Nginx logs
```

---

## Security Notes

- ✅ SSL/HTTPS enabled automatically
- ✅ Strong database password generated
- ✅ JWT secret auto-generated (32 chars)
- ✅ .env file secured (not in git)
- ✅ Daily database backups
- ✅ Separate database from Django project

---

## Port Allocation

| Service | Port | Access |
|---------|------|--------|
| Django (mycard) | 8000 | mycard.dupno.com |
| Taka Track API | 3001 | Internal only |
| Nginx | 80/443 | Public |

---

## Support

If you encounter issues:

1. Check `VPS_DEPLOYMENT.md` for detailed guide
2. Review logs: `pm2 logs takatrack-api`
3. Verify DNS: `dig takatracker.dupno.com`
4. Test locally: `curl http://localhost:3001/`

---

## Success Checklist

After deployment, verify:

- [ ] Backend running: `pm2 status` shows "online"
- [ ] Frontend accessible: https://takatracker.dupno.com
- [ ] API accessible: https://takatracker.dupno.com/api/v1
- [ ] SSL working: Green padlock in browser
- [ ] Django project still works: https://mycard.dupno.com
- [ ] Database created: `psql -U takatrack_user -d takatrack_db`

---

**🎉 You're all set! Your app should be live at https://takatracker.dupno.com**
