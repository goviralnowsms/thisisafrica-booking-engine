#!/bin/bash

echo "🔧 Fixing 502 Bad Gateway on Vultr server..."
echo "This script will SSH into the server and restart the application"
echo ""

# SSH into Vultr and fix the issue
ssh root@139.180.164.190 << 'ENDSSH'
echo "Connected to Vultr server..."
echo ""

# Check PM2 status
echo "Checking PM2 status..."
pm2 list
echo ""

# Check if the app directory exists
if [ ! -d /root/updated-tia ]; then
  echo "❌ App directory not found! Cloning repository..."
  cd /root
  git clone https://github.com/goviralnowsms/updated-tia.git
  cd updated-tia
else
  echo "✅ App directory exists"
  cd /root/updated-tia
  
  # Pull latest changes
  echo "Pulling latest changes..."
  git pull origin main
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build the application
echo "Building application..."
pnpm build

# Stop any existing PM2 processes
echo "Stopping existing PM2 processes..."
pm2 delete all 2>/dev/null || true

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start npm --name "updated-tia" -- start
pm2 save
pm2 startup systemd -u root --hp /root

# Check PM2 status again
echo ""
echo "Final PM2 status:"
pm2 list

# Test if the app is running
echo ""
echo "Testing if app is responding on port 3000..."
sleep 5
curl -I http://localhost:3000

echo ""
echo "✅ Application restart complete!"
echo "If nginx is configured, the site should be accessible at:"
echo "  - http://book.thisisafrica.com.au"
echo "  - http://139.180.164.190"
ENDSSH

echo ""
echo "🎉 Fix complete! Check http://book.thisisafrica.com.au"