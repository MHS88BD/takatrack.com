#!/bin/bash

# Quick Fix Script - Check and fix backend issues

echo "🔍 Checking TakaTrack Backend..."

# SSH into server and run diagnostics
ssh root@91.99.167.26 << 'ENDSSH'

cd /var/www/takatrack

echo "1️⃣ Checking PM2 Status:"
pm2 status

echo ""
echo "2️⃣ Checking Backend Logs (last 30 lines):"
pm2 logs takatrack-api --lines 30 --nostream

echo ""
echo "3️⃣ Checking .env file:"
cat .env

echo ""
echo "4️⃣ Testing API directly:"
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}' \
  2>&1

echo ""
echo "5️⃣ Checking Nginx configuration:"
sudo nginx -t

echo ""
echo "6️⃣ Checking if port 3001 is listening:"
sudo netstat -tlnp | grep 3001

ENDSSH
