#!/bin/bash

# Complete setup script for new EC2 instance with whitelisted IP
# This script will:
# 1. Set up the environment
# 2. Try to associate the whitelisted IP
# 3. Install and configure the application
# 4. Test the connection

set -e  # Exit on any error

WHITELISTED_IP="13.210.224.119"
YOUR_LOCAL_IP="110.175.119.93"
REPO_URL="https://github.com/your-username/tourplan-booking-engine.git"

echo "🚀 EC2 Setup with Whitelisted IP"
echo "================================="
echo "Target IP: $WHITELISTED_IP"
echo "Your Local IP: $YOUR_LOCAL_IP"
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y curl wget unzip jq python3 python3-pip

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install AWS CLI
echo "📦 Installing AWS CLI..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws/

# Install Python packages
echo "📦 Installing Python packages..."
pip3 install requests

echo "✅ Basic setup complete!"
echo ""

# Try to associate whitelisted IP
echo "🔗 Attempting to associate whitelisted IP..."
if [ -f "scripts/associate-whitelisted-ip.sh" ]; then
    bash scripts/associate-whitelisted-ip.sh
else
    echo "⚠️  IP association script not found. You may need to do this manually."
fi

echo ""
echo "🧪 Testing current IP..."
python3 -c "
import requests
try:
    ip = requests.get('https://api.ipify.org', timeout=5).text.strip()
    print(f'Current IP: {ip}')
    if ip == '$WHITELISTED_IP':
        print('✅ SUCCESS: You have the whitelisted IP!')
    else:
        print('⚠️  WARNING: IP does not match whitelisted IP')
except Exception as e:
    print(f'❌ Could not check IP: {e}')
"

echo ""
echo "📋 Next Steps:"
echo "1. Configure AWS CLI if not already done: aws configure"
echo "2. Clone your repository: git clone $REPO_URL"
echo "3. Set up environment variables"
echo "4. Run the application"
echo ""
echo "🔧 Manual IP Association (if automatic failed):"
echo "1. Go to AWS Console → EC2 → Elastic IPs"
echo "2. Find IP $WHITELISTED_IP"
echo "3. Associate it with this instance"
echo ""
echo "📞 Need help? Check docs/EC2_IP_ASSOCIATION_GUIDE.md"
