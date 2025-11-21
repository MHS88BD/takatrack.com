# 🚀 Deployment Guide - SMMUH Finance Tracker

## Quick Deployment Options

### Option 1: Railway (Recommended for Backend)

#### Backend Deployment

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Environment Variables**
   ```
   DATABASE_URL=postgresql://...  (Railway will provide this)
   JWT_SECRET=your-super-secret-key-change-this
   NODE_ENV=production
   PORT=3000
   ```

4. **Add Start Script**
   Railway will automatically detect and run:
   ```json
   "start": "ts-node src/server.ts"
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Run migrations: `npx prisma migrate deploy`
   - Your API will be live at: `https://your-app.railway.app`

### Option 2: Render (Alternative Backend)

1. **Sign up at [Render.com](https://render.com)**

2. **Create Web Service**
   - Connect GitHub repository
   - Select "Node" environment

3. **Configure**
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

4. **Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```

5. **Add PostgreSQL Database**
   - Create new PostgreSQL instance
   - Copy connection string to DATABASE_URL

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Import Project"
   - Select your repository
   - Set root directory to `client`

3. **Configure Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables**
   - Add your production API URL if needed

5. **Deploy**
   - Vercel will auto-deploy on every push

#### Option 2: Netlify

1. **Sign up at [Netlify.com](https://netlify.com)**

2. **New Site from Git**
   - Connect repository
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

3. **Deploy**

## Manual Deployment (VPS/DigitalOcean)

### Backend Setup

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   ```

4. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd "Antigravity Projects"
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Set up environment**
   ```bash
   nano .env
   ```
   Add:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
   JWT_SECRET="your-secret-key"
   PORT=3000
   NODE_ENV=production
   ```

7. **Run migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

8. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

9. **Start application**
   ```bash
   pm2 start npm --name "finance-api" -- start
   pm2 save
   pm2 startup
   ```

10. **Set up Nginx reverse proxy**
    ```bash
    sudo apt-get install nginx
    sudo nano /etc/nginx/sites-available/finance-api
    ```
    
    Add:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Enable site**
    ```bash
    sudo ln -s /etc/nginx/sites-available/finance-api /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

12. **Set up SSL with Let's Encrypt**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

### Frontend Setup (Static Hosting)

1. **Build locally**
   ```bash
   cd client
   npm run build
   ```

2. **Upload dist folder to:**
   - AWS S3 + CloudFront
   - Netlify
   - Vercel
   - GitHub Pages

## Database Migration (SQLite to PostgreSQL)

1. **Update Prisma schema**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create migration**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Deploy to production**
   ```bash
   npx prisma migrate deploy
   ```

## Environment Variables Checklist

### Backend
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Strong secret key (min 32 characters)
- ✅ `PORT` - Server port (default: 3000)
- ✅ `NODE_ENV` - Set to "production"

### Frontend
- ✅ Update API URL in code to production backend

## Post-Deployment Checklist

- [ ] Backend is accessible via HTTPS
- [ ] Frontend is accessible via HTTPS
- [ ] Database migrations are applied
- [ ] Environment variables are set
- [ ] API endpoints are working
- [ ] Authentication is working
- [ ] CORS is configured correctly
- [ ] SSL certificates are installed
- [ ] Domain is configured
- [ ] Monitoring is set up (optional)
- [ ] Backups are configured (optional)

## Monitoring & Logging

### Backend Monitoring
- Use PM2 for process management
- Set up error logging with Winston
- Use services like:
  - Sentry (error tracking)
  - LogRocket (session replay)
  - New Relic (performance)

### Database Backups
```bash
# PostgreSQL backup
pg_dump -U username -d database_name > backup.sql

# Restore
psql -U username -d database_name < backup.sql
```

## Troubleshooting

### Backend not starting
- Check environment variables
- Verify database connection
- Check logs: `pm2 logs finance-api`

### Database connection issues
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Verify firewall rules

### Frontend not loading
- Check API URL is correct
- Verify CORS settings
- Check browser console for errors

## Cost Estimates

### Free Tier Options
- **Railway**: $5/month (500 hours free)
- **Render**: Free tier available
- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects

### Paid Options
- **DigitalOcean**: $6/month (basic droplet)
- **AWS**: Variable, ~$10-20/month
- **Heroku**: $7/month per dyno

## Support

For issues or questions:
1. Check the logs
2. Review environment variables
3. Test API endpoints
4. Check database connection

---

**Last Updated**: November 2025
**Status**: Ready for Production Deployment
