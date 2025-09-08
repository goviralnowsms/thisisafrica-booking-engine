#!/bin/bash

echo "🚀 Manual deployment script for Vultr"
echo "======================================="

# Go to the project directory
cd /root/updated-tia || { echo "❌ Project directory not found"; exit 1; }

echo "📥 Pulling latest code..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

echo "🔧 Setting up environment..."
if [ -f update-env-production.sh ]; then
  chmod +x update-env-production.sh
  ./update-env-production.sh
else
  echo "⚠️  update-env-production.sh not found, creating basic .env.production.local"
  cat > .env.production.local << 'EOF'
NEXT_PUBLIC_APP_URL=https://book.thisisafrica.com.au
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi
TOURPLAN_AGENT_ID=SAMAGT
TOURPLAN_PASSWORD=S@MAgt01
STRIPE_SECRET_KEY=sk_test_51RYzX3I7q377qvY0tV1r8zvaaFqc6VRpfJBSjKS8yLqwVncitScxUi03ZofSAdOpD4JsXuEQHc4apGKqj7cI6nBX00KKzvpGtZ
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RYzX3I7q377qvY08WDWHO5slz0a2Lua9lw8ibgNvAcAcmy1OFsiupYkjJSuiWEbubKcrXnx1xAsD3fVP8NPUTSm00isPspOLB
NODE_ENV=production
EOF
  chmod 600 .env.production.local
fi

echo "📦 Installing dependencies..."
pnpm install || { echo "❌ pnpm install failed"; exit 1; }

echo "🔨 Building project..."
pnpm build || { echo "❌ Build failed"; exit 1; }

echo "🔍 Checking current PM2 processes..."
pm2 list

echo "🛑 Stopping all PM2 processes..."
pm2 stop all
pm2 delete all

echo "🚀 Starting new PM2 process..."
PORT=3000 pm2 start pnpm --name updated-tia -- start

echo "💾 Saving PM2 configuration..."
pm2 save

echo "📊 PM2 process status..."
pm2 list

echo "🔄 Restarting nginx..."
nginx -t && systemctl reload nginx

echo "✅ Deployment complete!"
echo "🔍 Test the debug endpoint: https://book.thisisafrica.com.au/api/debug-payment"
echo "🌐 Test the main site: https://book.thisisafrica.com.au"