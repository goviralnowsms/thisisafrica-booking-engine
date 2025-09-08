#!/bin/bash

echo "🔧 Direct SSH fix for 502 Bad Gateway..."
echo ""

# Direct SSH commands
ssh root@139.180.164.190 << 'EOF'
echo "=== Connected to Vultr server ==="

# Stop everything first
pm2 delete all 2>/dev/null || true
killall node 2>/dev/null || true

# Remove old directory if exists
if [ -d /root/updated-tia ]; then
  echo "Removing old directory..."
  rm -rf /root/updated-tia
fi

# Clone fresh repository
echo "Cloning repository..."
cd /root
git clone https://github.com/goviralnowsms/updated-tia.git
cd /root/updated-tia

# Check if clone was successful
if [ ! -f package.json ]; then
  echo "❌ Clone failed! Package.json not found"
  exit 1
fi

# Install pnpm if not installed
if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Create production environment file
echo "Creating .env.production.local..."
cat > .env.production.local << 'ENVFILE'
NEXT_PUBLIC_APP_URL=https://book.thisisafrica.com.au
APP_URL=https://book.thisisafrica.com.au
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi
TOURPLAN_AGENT_ID=SAMAGT
TOURPLAN_PASSWORD=S@MAgt01
TOURPLAN_TIMEOUT=30000
TOURPLAN_RETRIES=3
NEXT_PUBLIC_SANITY_PROJECT_ID=h4qu7hkw
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-09-04
SANITY_API_TOKEN=skUREaXA9lNLT1nmAZljtznXRIhMhsjsV3W2bmMmB9VdZGqUvfE7YasI6hoaYk1dppUKnHTz7KOpbxm4SkIQMi9XKiReiyL2861TwfhX6JshNHCKkAnuX6jYcQqziFsUIYaD3YT0gZV6djEzq1mHzWuMw13p9VZPBq7fxNfPWP4pzsrBE1ZP
SUPABASE_URL=https://qtbfvjggnupqgoekjdtm.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://qtbfvjggnupqgoekjdtm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YmZ2amdnbnVwcWdvZWtqZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTEzOTgsImV4cCI6MjA1ODg4NzM5OH0.iv08lwHigKFRzaS5o4b3HjLZLqQMPxM-jnfgVdyktDc
STRIPE_SECRET_KEY=sk_test_51RYzX3I7q377qvY0tV1r8zvaaFqc6VRpfJBSjKS8yLqwVncitScxUi03ZofSAdOpD4JsXuEQHc4apGKqj7cI6nBX00KKzvpGtZ
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RYzX3I7q377qvY08WDWHO5slz0a2Lua9lw8ibgNvAcAcmy1OFsiupYkjJSuiWEbubKcrXnx1xAsD3fVP8NPUTSm00isPspOLB
NODE_ENV=production
ENVFILE

# Build the application
echo "Building application..."
pnpm build

# Start with PM2
echo "Starting application with PM2..."
pm2 start npm --name "book-tia" -- start
pm2 save --force
pm2 startup systemd -u root --hp /root

# Verify nginx is installed and configured
echo "Checking nginx..."
if ! systemctl is-active --quiet nginx; then
  echo "Starting nginx..."
  systemctl start nginx
  systemctl enable nginx
fi

# Check if app is running
sleep 5
echo ""
echo "=== Checking application status ==="
pm2 list
echo ""
echo "Testing localhost:3000..."
curl -I http://localhost:3000 2>/dev/null | head -n 1

echo ""
echo "✅ Fix complete!"
EOF

echo ""
echo "🎉 Done! Check http://book.thisisafrica.com.au"