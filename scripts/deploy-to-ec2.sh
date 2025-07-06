#!/bin/bash

# EC2 Deployment Script for Tourplan Booking Engine
set -e

echo "🚀 Starting deployment to EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
print_status "EC2 Public IP: $EC2_IP"

# Update system
print_status "Updating system packages..."
sudo dnf update -y

# Install Git if not already installed
if ! command -v git &> /dev/null; then
    print_status "Installing Git..."
    sudo dnf install -y git
fi

# Install Node.js 18 if not already installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 18..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
else
    print_status "Node.js version: $(node --version)"
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_status "PM2 version: $(pm2 --version)"
fi

# Clone repository
APP_DIR="/home/ec2-user/booking-engine"
if [ -d "$APP_DIR" ]; then
    print_warning "Directory exists, backing up..."
    mv "$APP_DIR" "${APP_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
fi

print_status "Cloning repository..."
git clone https://github.com/goviralnowsms/booking-engine.git "$APP_DIR"
cd "$APP_DIR"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Create environment file
print_status "Creating environment configuration..."
cat > .env.local << EOF
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

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

print_warning "⚠️  IMPORTANT: Edit .env.local with your actual API keys and credentials!"
print_status "Environment file created at: $APP_DIR/.env.local"

# Build the application
print_status "Building application..."
npm run build

# Stop existing PM2 process if running
pm2 delete booking-engine 2>/dev/null || true

# Start with PM2
print_status "Starting application with PM2..."
pm2 start npm --name "booking-engine" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (run only once)
if ! systemctl is-enabled pm2-ec2-user &>/dev/null; then
    print_status "Setting up PM2 startup script..."
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
fi

print_status "✅ Deployment complete!"
print_status "🌐 Your app should be running on: http://$EC2_IP:3000"
print_status "📊 Check PM2 status: pm2 status"
print_status "📝 View logs: pm2 logs booking-engine"
print_warning "🔧 Don't forget to edit .env.local with your actual credentials!"

echo ""
echo "Next steps:"
echo "1. Edit .env.local: nano .env.local"
echo "2. Restart app: pm2 restart booking-engine"
echo "3. Check status: pm2 status"
echo "4. View logs: pm2 logs booking-engine"
