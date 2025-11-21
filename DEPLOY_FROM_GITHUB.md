# 🚀 Deploy Taka Track from GitHub

This guide will help you deploy Taka Track directly from your GitHub repository to various hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub repository: `https://github.com/MHS88BD/takatrack.com`
- ✅ All code pushed to GitHub
- ✅ A hosting platform account (Railway, Render, or Vercel)

---

## 🎯 Option 1: Railway (Recommended - Easiest)

### Backend Deployment

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "Login" and sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `MHS88BD/takatrack.com`
   - Railway will auto-detect the configuration from `railway.json`

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create `DATABASE_URL` variable

4. **Set Environment Variables**
   - Click on your service → "Variables"
   - Add these variables:
   ```
   JWT_SECRET=your-super-secret-32-character-key-here
   NODE_ENV=production
   PORT=3000
   ```
   - `DATABASE_URL` is automatically set by Railway

5. **Deploy**
   - Railway will automatically:
     - Install dependencies
     - Generate Prisma client
     - Build TypeScript
     - Run database migrations
     - Start the server
   - Your API will be live at: `https://your-app.up.railway.app`

6. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your domain: `api.takatrack.dupno.com`
   - Update DNS as instructed

### Frontend Deployment (Vercel)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select `MHS88BD/takatrack.com`
   - Framework Preset: **Vite**
   - Root Directory: **client**

3. **Configure Build**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**
   - Add variable:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api/v1
   ```

5. **Deploy**
   - Click "Deploy"
   - Your app will be live at: `https://your-app.vercel.app`

6. **Custom Domain**
   - Go to Settings → Domains
   - Add: `takatrack.dupno.com`

---

## 🎯 Option 2: Render

### Backend Deployment

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Sign in with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect GitHub: `MHS88BD/takatrack.com`
   - Name: `takatrack-api`
   - Environment: **Node**
   - Branch: **main**
   - Root Directory: leave empty

3. **Build Settings**
   ```
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npx prisma migrate deploy && npm start
   ```

4. **Add PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Name: `takatrack-db`
   - Copy the Internal Database URL

5. **Environment Variables**
   - In your web service, go to "Environment"
   - Add:
   ```
   DATABASE_URL=<paste-internal-database-url>
   JWT_SECRET=your-super-secret-32-character-key
   NODE_ENV=production
   PORT=3000
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy
   - Your API: `https://takatrack-api.onrender.com`

### Frontend Deployment (Same as Railway - use Vercel)

---

## 🎯 Option 3: Heroku

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create App from GitHub**
   - Go to [dashboard.heroku.com](https://dashboard.heroku.com)
   - Click "New" → "Create new app"
   - App name: `takatrack-api`
   - Connect to GitHub: `MHS88BD/takatrack.com`
   - Enable automatic deploys from `main` branch

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini -a takatrack-api
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key -a takatrack-api
   heroku config:set NODE_ENV=production -a takatrack-api
   ```

6. **Deploy**
   - Push to GitHub main branch
   - Heroku will auto-deploy
   - Your API: `https://takatrack-api.herokuapp.com`

---

## ✅ Post-Deployment Checklist

### 1. Verify Backend
```bash
# Test health endpoint
curl https://your-backend-url.com/

# Test auth
curl -X POST https://your-backend-url.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 2. Update Frontend API URL
- In Vercel, update `VITE_API_URL` to your deployed backend URL
- Redeploy frontend

### 3. Test Complete Flow
- Visit your frontend URL
- Register a new account
- Create a wallet
- Add a transaction
- Verify everything works

### 4. Configure CORS
Ensure your backend allows your frontend domain in `src/app.ts`:
```typescript
app.use(cors({
  origin: [
    'https://takatrack.dupno.com',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

---

## 🔄 Continuous Deployment

### Automatic Deployments
All platforms support automatic deployment from GitHub:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy**
   - Railway: Deploys automatically
   - Render: Deploys automatically
   - Vercel: Deploys automatically
   - Heroku: Deploys automatically (if enabled)

### Manual Deployment
If you need to manually trigger:
- **Railway**: Click "Deploy" in dashboard
- **Render**: Click "Manual Deploy" → "Deploy latest commit"
- **Vercel**: Click "Redeploy" in deployments
- **Heroku**: Push to Heroku remote

---

## 🔧 Environment Variables Reference

### Backend (.env)
```env
# Database (auto-provided by hosting platform)
DATABASE_URL=postgresql://user:password@host:5432/database

# Required - Generate a strong secret
JWT_SECRET=your-super-secret-32-character-minimum-key

# Environment
NODE_ENV=production

# Port (usually auto-set by platform)
PORT=3000
```

### Frontend (Vercel)
```env
# Your deployed backend URL
VITE_API_URL=https://your-backend-url.com/api/v1
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check logs in platform dashboard
# Common issues:
- Missing environment variables
- TypeScript errors
- Prisma client not generated

# Solution:
- Ensure all env vars are set
- Check build logs
- Verify package.json scripts
```

### Database Connection Fails
```bash
# Check DATABASE_URL format
# PostgreSQL format:
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# Ensure migrations ran:
npx prisma migrate deploy
```

### API Not Responding
```bash
# Check:
1. Service is running (check platform logs)
2. PORT is correctly set
3. CORS is configured
4. Database is connected
```

### Frontend Can't Connect to Backend
```bash
# Check:
1. VITE_API_URL is correct
2. Backend CORS allows frontend domain
3. Backend is actually running
4. No typos in URL
```

---

## 📊 Deployment Costs

### Free Tier
- **Railway**: $5 credit/month (500 hours)
- **Render**: Free tier available (sleeps after inactivity)
- **Vercel**: Free for personal projects
- **Heroku**: $5-7/month (no free tier anymore)

### Recommended for Production
- **Railway**: ~$10-15/month (backend + database)
- **Vercel**: Free (frontend)
- **Total**: ~$10-15/month

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend**: `https://takatrack.dupno.com`
- **Backend**: `https://api.takatrack.dupno.com`

### Next Steps
1. ✅ Test all features
2. ✅ Set up monitoring (optional)
3. ✅ Configure custom domains
4. ✅ Share with users!

---

## 📞 Need Help?

- Check platform documentation
- Review deployment logs
- Open an issue on GitHub
- Check `DEPLOYMENT_CHECKLIST.md`

**Your app is ready to deploy! 🚀**
