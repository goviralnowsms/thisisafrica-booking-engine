#!/bin/bash
set -e

echo "🚀 Starting Tourplan Booking Engine Deployment..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system
print_status "Updating system packages..."
sudo dnf update -y

# Install Node.js 18
print_status "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install PM2 globally
print_status "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    print_status "PM2 already installed"
fi

# Install Git
print_status "Installing Git..."
if ! command -v git &> /dev/null; then
    sudo dnf install -y git
else
    print_status "Git already installed"
fi

# Clone repository
print_status "Cloning repository..."
cd /home/ec2-user
if [ -d "booking-engine" ]; then
    print_status "Directory exists, pulling latest changes..."
    cd booking-engine
    git pull origin main || git pull origin master
else
    git clone https://github.com/goviralnowsms/booking-engine.git
    cd booking-engine
fi

# Install dependencies
print_status "Installing npm dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_warning "Creating .env.local template..."
    cat > .env.local << 'EOF'
# Database Configuration - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration - Neon (Alternative)
NEON_NEON_NEON_NEON_DATABASE_URL=postgresql://username:password@host/database

# Tourplan API Configuration
TOURPLAN_API_URL=https://xml.tourplan.com/tourplan/xml/request.asp
TOURPLAN_USERNAME=your_tourplan_username
TOURPLAN_PASSWORD=your_tourplan_password
TOURPLAN_AGENT_ID=your_agent_id

# Optional: Tourplan Proxy Configuration
TOURPLAN_PROXY_URL=http://your-proxy-url
USE_TOURPLAN_PROXY=false

# Payment Configuration - Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration - Resend
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Alternative Email Configuration - SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://NEW_IP_ADDRESS:3000
APP_URL=http://NEW_IP_ADDRESS:3000

# Environment
NODE_ENV=production
EOF
    print_error "⚠️  IMPORTANT: Edit .env.local with your actual values!"
    print_status "Run: nano .env.local"
    print_status "Replace all 'your_*' placeholders with real API keys"
    print_status "After editing, run this script again or continue manually"
    echo ""
    print_status "Press Enter to continue with deployment (you can edit .env.local later)..."
    read
fi

# Build the application
print_status "Building Next.js application..."
npm run build

# Stop existing PM2 process if running
print_status "Stopping existing processes..."
pm2 delete booking-engine 2>/dev/null || true

# Start with PM2
print_status "Starting application with PM2..."
pm2 start npm --name "booking-engine" -- start

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Setup PM2 startup
print_status "Setting up PM2 startup..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

print_status "Checking PM2 status..."
pm2 status

print_status "Testing health endpoint..."
sleep 5
curl -f http://localhost:3000/api/health || print_warning "Health check failed - app may still be starting"

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}🌐 Your app should be running at: http://NEW_IP_ADDRESS:3000${NC}"
echo -e "${BLUE}🏥 Health check: http://NEW_IP_ADDRESS:3000/api/health${NC}"
echo -e "${BLUE}🌍 IP check: http://NEW_IP_ADDRESS:3000/api/check-ip${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "📊 pm2 status           - Check process status"
echo "📝 pm2 logs booking-engine - View application logs"
echo "🔄 pm2 restart booking-engine - Restart the application"
echo "⏹️  pm2 stop booking-engine - Stop the application"
echo "🗑️  pm2 delete booking-engine - Remove the application"
echo ""
echo -e "${YELLOW}Don't forget to edit .env.local with your actual API keys!${NC}"
echo "Run: nano .env.local"
