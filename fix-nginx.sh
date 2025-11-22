#!/bin/bash

# Fix Nginx Configuration for TakaTrack

echo "🔧 Fixing Nginx configuration..."

# Create the correct Nginx config
sudo tee /etc/nginx/sites-available/takatracker.dupno.com > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name takatracker.dupno.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name takatracker.dupno.com;

    # SSL Configuration (if you have SSL certificates)
    # ssl_certificate /etc/letsencrypt/live/takatracker.dupno.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/takatracker.dupno.com/privkey.pem;

    # Frontend - Serve static files
    root /var/www/takatrack/client/dist;
    index index.html;

    # API Proxy - Forward /api requests to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend - Serve React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

echo "✅ Nginx config created"

# Test configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    
    # Restart Nginx
    echo "🔄 Restarting Nginx..."
    sudo systemctl restart nginx
    
    echo "✅ Nginx restarted"
    
    # Test API through Nginx
    echo ""
    echo "🧪 Testing API through Nginx..."
    curl -k https://takatracker.dupno.com/api/v1/ 2>&1
    
    echo ""
    echo "✅ Done! Try signup/login now in your browser."
else
    echo "❌ Nginx config has errors. Please check the output above."
fi
