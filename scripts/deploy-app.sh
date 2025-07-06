#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")
print_status "EC2 Public IP: $EC2_IP"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "❌ package.json not found. Make sure you're in the project directory."
    print_status "Current directory: $(pwd)"
    print_status "Files in current directory:"
    ls -la
    exit 1
fi

print_header "STEP 1: INSTALLING DEPENDENCIES"
print_status "Installing npm dependencies..."
npm install

print_header "STEP 2: CHECKING ENVIRONMENT CONFIG"
if [ ! -f ".env.local" ]; then
    print_warning "⚠️  .env.local not found. Creating template..."
    cat > .env.local << EOF
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Neon Database (Alternative)
NEON_NEON_NEON_DATABASE_URL=postgresql://username:password@host/database

# Tourplan API Configuration
TOURPLAN_API_URL=https://xml.tourplan.com/tourplan/
TOURPLAN_USERNAME=your_tourplan_username
TOURPLAN_PASSWORD=your_tourplan_password
TOURPLAN_AGENT_ID=your_agent_id

# Optional: Tourplan Proxy Configuration
TOURPLAN_PROXY_URL=http://your-proxy-url
USE_TOURPLAN_PROXY=false

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Alternative SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://$EC2_IP:3000
APP_URL=http://$EC2_IP:3000

# Environment
NODE_ENV=production
EOF
    print_warning "📝 Please edit .env.local with your actual values before continuing."
    print_status "Run: nano .env.local"
    exit 1
else
    print_status "✅ .env.local found"
fi

print_header "STEP 3: BUILDING APPLICATION"
print_status "Building Next.js application..."
npm run build

print_header "STEP 4: DEPLOYING WITH PM2"

# Stop existing PM2 process if it exists
print_status "Stopping existing PM2 processes..."
pm2 delete booking-engine 2>/dev/null || true

# Start with PM2
print_status "Starting application with PM2..."
pm2 start npm --name "booking-engine" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup
print_status "Setting up PM2 startup script..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

print_header "DEPLOYMENT COMPLETE!"
print_status "✅ Everything deployed successfully!"
echo ""
echo -e "${GREEN}🌐 Your application is running at: http://$EC2_IP:3000${NC}"
echo ""
echo -e "${YELLOW}Important next steps:${NC}"
echo "1. 🔧 Edit environment variables: nano .env.local"
echo "2. 🔄 Restart app after config changes: pm2 restart booking-engine"
echo "3. 📊 Check application status: pm2 status"
echo "4. 📝 View application logs: pm2 logs booking-engine"
echo "5. 🏥 Test health endpoint: curl http://$EC2_IP:3000/api/health"
echo "6. 🌍 Test IP endpoint: curl http://$EC2_IP:3000/api/check-ip"
echo ""
echo -e "${RED}⚠️  CRITICAL: You MUST edit .env.local with your actual API keys before the app will work properly!${NC}"
