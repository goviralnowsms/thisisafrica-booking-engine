#!/bin/bash

# Production startup script
echo "🚀 Starting production server..."

# Navigate to app directory
cd /home/ec2-user/tourplan-booking-engine

# Build the application
echo "🔨 Building application..."
npm run build

# Start with PM2
echo "▶️ Starting with PM2..."
pm2 start npm --name "tourplan-booking" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo "✅ Application started successfully!"
echo "📊 Monitor with: pm2 monit"
echo "📋 View logs with: pm2 logs tourplan-booking"
echo "🔄 Restart with: pm2 restart tourplan-booking"
