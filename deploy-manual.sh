#!/bin/bash

echo "🚀 Manual deployment script for Vultr"
echo "======================================="

# Go to the project directory
cd /root/updated-tia || { echo "❌ Project directory not found"; exit 1; }

echo "📥 Pulling latest code..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

echo "🔧 Checking environment setup..."

# CRITICAL: Never overwrite existing .env.production.local
if [ -f .env.production.local ]; then
  echo "✅ Using existing .env.production.local"

  # Run update script if it exists (for adding new variables)
  if [ -f update-env-production.sh ]; then
    echo "📝 Running environment update script..."
    chmod +x update-env-production.sh
    ./update-env-production.sh
  fi
else
  echo "⚠️  .env.production.local not found!"

  # Try to copy from .env.local if it exists
  if [ -f .env.local ]; then
    echo "📋 Creating .env.production.local from .env.local"
    cp .env.local .env.production.local

    # Update app URL for production
    sed -i 's|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://book.thisisafrica.com.au|g' .env.production.local
    sed -i 's|NODE_ENV=.*|NODE_ENV=production|g' .env.production.local

    echo "✅ Created .env.production.local from .env.local"
  else
    echo "❌ ERROR: No environment file found!"
    echo "Please create .env.production.local with all necessary variables"
    echo "You can copy from your local .env.local file"
    exit 1
  fi
fi

# Ensure proper permissions
chmod 600 .env.production.local

echo "🧹 Clearing build cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Installing dependencies..."
pnpm install || { echo "❌ pnpm install failed"; exit 1; }

echo "🔨 Building project..."
pnpm build || { echo "❌ Build failed"; exit 1; }

echo "🔍 Checking current PM2 processes..."
pm2 list

# Check if ecosystem config exists locally
if [ -f ecosystem.config.js ]; then
    echo "🔄 Using PM2 ecosystem config for zero-downtime deployment..."

    # Check if app is already running
    if pm2 list | grep -q "thisisafrica"; then
        echo "♻️ Performing zero-downtime reload..."
        pm2 reload ecosystem.config.js --update-env
    else
        echo "🚀 Starting application with cluster mode..."
        pm2 start ecosystem.config.js
    fi
else
    # Fallback to old method if ecosystem config doesn't exist
    echo "⚠️  No ecosystem.config.js found, using legacy deployment (will cause downtime)..."
    echo "🛑 Stopping all PM2 processes..."
    pm2 stop all
    pm2 delete all

    echo "🚀 Starting new PM2 process..."
    PORT=3000 pm2 start pnpm --name updated-tia -- start
fi

echo "💾 Saving PM2 configuration..."
pm2 save

echo "📊 PM2 process status..."
pm2 list

echo "🔄 Restarting nginx..."
nginx -t && systemctl reload nginx

echo "✅ Deployment complete!"
echo "🔍 Test the debug endpoint: https://book.thisisafrica.com.au/api/debug-payment"
echo "🌐 Test the main site: https://book.thisisafrica.com.au"