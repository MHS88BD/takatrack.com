#!/bin/bash
echo "Deploying V4 Redesign (Top Nav & Dashboard)..."

# 1. Rebuild Frontend
cd /var/www/takatrack/client
echo "Installing dependencies..."
npm install
echo "Building frontend..."
npm run build

# 2. Deploy to Nginx
echo "Deploying to web root..."
sudo cp -r dist/* /var/www/takatrack/html

# 3. Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment Complete! Please hard refresh your browser."
