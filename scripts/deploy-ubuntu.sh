#!/bin/bash

# Ubuntu 24.04 Deployment Script for Tourplan Booking Engine
set -e

echo "🚀 Starting Ubuntu 24.04 deployment..."

# Get EC2 instance IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "📍 Detected EC2 IP: $EC2_IP"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2, Git, and other tools
echo "📦 Installing PM2 and tools..."
sudo npm install -g pm2
sudo apt install -y git curl wget unzip

# Create project directory
echo "📁 Setting up project directory..."
cd /home/ubuntu
mkdir -p booking-engine
cd booking-engine

# Check if this is a fresh deployment or update
if [ ! -f "package.json" ]; then
    echo "📥 This appears to be a fresh deployment."
    echo "Please upload your project files or clone from git repository."
    echo "You can use SCP to upload files:"
    echo "scp -r -i your-key.pem ./your-project/* ubuntu@$EC2_IP:/home/ubuntu/booking-engine/"
else
    echo "🔄 Existing project detected, updating..."
fi

# Create environment template if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment template..."
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

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🏗️  Building application..."
    npm run build
    
    # Stop existing PM2 process if running
    pm2 delete tourplan-booking 2>/dev/null || true
    
    echo "🚀 Starting application with PM2..."
    pm2 start npm --name "tourplan-booking" -- start
    pm2 save
    
    # Setup PM2 startup
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
    
    echo "✅ Application started successfully!"
    echo "🌐 Access your app at: http://$EC2_IP:3000"
    echo "🏥 Health check: http://$EC2_IP:3000/api/health"
else
    echo "⚠️  No package.json found. Please upload your project files first."
fi

# Create health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
echo "🏥 Running health checks..."

# Check PM2 status
echo "📊 PM2 Status:"
pm2 status

# Check if port 3000 is listening
echo "🔌 Port 3000 Status:"
netstat -tlnp | grep 3000 || echo "Port 3000 not listening"

# Check local health endpoint
echo "🏥 Local Health Check:"
curl -s http://localhost:3000/api/health || echo "Local health check failed"

# Check external health endpoint
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "🌐 External Health Check:"
curl -s http://$EC2_IP:3000/api/health || echo "External health check failed"

echo "✅ Health check complete!"
EOF

chmod +x health-check.sh

echo "🎉 Deployment script completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your actual API keys: nano .env.local"
echo "2. If you haven't uploaded files yet, use SCP or git clone"
echo "3. Run health check: ./health-check.sh"
echo "4. View logs: pm2 logs tourplan-booking"
echo "5. Access app: http://$EC2_IP:3000"
