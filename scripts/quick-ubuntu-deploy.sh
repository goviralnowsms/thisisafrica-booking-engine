#!/bin/bash

# Quick deployment script to upload and deploy to Ubuntu EC2
set -e

# Configuration - UPDATE THESE VALUES
EC2_IP="YOUR_EC2_IP_HERE"  # Replace with your actual EC2 IP
SSH_KEY="$HOME/Downloads/tourplan-ubuntu-key.pem"  # Path to your SSH key
EC2_USER="ubuntu"

echo "🚀 Quick Ubuntu Deployment Script"
echo "📍 Target: $EC2_USER@$EC2_IP"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH key not found: $SSH_KEY"
    echo "Please update the SSH_KEY variable in this script"
    exit 1
fi

# Test SSH connection
echo "🔐 Testing SSH connection..."
ssh -i "$SSH_KEY" -o ConnectTimeout=10 "$EC2_USER@$EC2_IP" "echo 'SSH connection successful'" || {
    echo "❌ SSH connection failed"
    echo "Please check:"
    echo "1. EC2 IP address is correct"
    echo "2. SSH key path is correct"
    echo "3. Security group allows SSH from your IP"
    exit 1
}

# Create remote directory
echo "📁 Creating remote directory..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_IP" "mkdir -p /home/ubuntu/booking-engine"

# Upload project files (excluding node_modules and .next)
echo "📤 Uploading project files..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '*.log' \
    -e "ssh -i $SSH_KEY" \
    ./ "$EC2_USER@$EC2_IP:/home/ubuntu/booking-engine/"

# Run deployment on remote server
echo "🚀 Running deployment on remote server..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_IP" << 'ENDSSH'
cd /home/ubuntu/booking-engine

# Get EC2 IP for environment configuration
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Update system if needed
sudo apt update

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Create/update environment file
if [ ! -f ".env.local" ]; then
    echo "Creating environment file..."
    cat > .env.local << EOF
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Tourplan API Configuration
TOURPLAN_API_URL=https://xml.tourplan.com/tourplan/xml/request.asp
TOURPLAN_USERNAME=your_username_here
TOURPLAN_PASSWORD=your_password_here
TOURPLAN_AGENT_ID=your_agent_id_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Application URLs
NEXT_PUBLIC_APP_URL=http://$EC2_IP:3000
APP_URL=http://$EC2_IP:3000

# Environment
NODE_ENV=production
PORT=3000
EOF
    echo "⚠️  Please edit .env.local with your actual API keys!"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Stop existing PM2 process
pm2 delete tourplan-booking 2>/dev/null || true

# Start with PM2
echo "Starting application..."
pm2 start npm --name "tourplan-booking" -- start
pm2 save

# Setup startup script
pm2 startup 2>/dev/null || true

echo "✅ Deployment completed!"
echo "🌐 Access your app at: http://$EC2_IP:3000"
echo "🏥 Health check: http://$EC2_IP:3000/api/health"
ENDSSH

echo "🎉 Quick deployment completed!"
echo ""
echo "Next steps:"
echo "1. SSH to your server: ssh -i $SSH_KEY $EC2_USER@$EC2_IP"
echo "2. Edit environment: nano /home/ubuntu/booking-engine/.env.local"
echo "3. Restart app: pm2 restart tourplan-booking"
echo "4. Check status: pm2 status"
echo "5. View logs: pm2 logs tourplan-booking"
