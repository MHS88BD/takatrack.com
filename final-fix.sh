#!/bin/bash

# Final Fix - Frontend Build & Nginx Config
# This fixes the "Network Error" by ensuring the frontend knows where the API is.

echo "🚀 Starting Final Fix..."

APP_DIR="/var/www/takatrack"
DOMAIN="takatracker.dupno.com"

cd $APP_DIR

# 1. Rebuild Frontend with correct API URL
echo "🎨 Rebuilding Frontend..."
cd client
# Clean install to be safe
rm -rf dist node_modules package-lock.json
npm install

# Build with relative API path so it uses the current domain
# This is CRITICAL for the frontend to find the backend
export VITE_API_URL="/api/v1"
npm run build

echo "✅ Frontend built with API_URL=/api/v1"

# 2. Update Nginx Configuration
echo "🔧 Updating Nginx Config..."
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # Frontend - Serve static files
    root $APP_DIR/client/dist;
    index index.html;

    # API Proxy - Forward /api requests to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Frontend - Serve React app (SPA support)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 3. Restart Nginx
echo "🔄 Restarting Nginx..."
sudo nginx -t && sudo systemctl restart nginx

echo ""
echo "✅ Final Fix Complete!"
echo "👉 Please clear your browser cache (Ctrl+Shift+R) and try again."
