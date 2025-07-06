#!/bin/bash
# Setup script to run on your EC2 instance after SSH connection

echo "🚀 Setting up EC2 environment for Tourplan booking engine"
echo "========================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ]; then
    echo -e "${RED}❌ This script should be run as the ubuntu user${NC}"
    echo "Please SSH in as: ssh -i your-key.pem ubuntu@13.211.226.114"
    exit 1
fi

echo -e "${BLUE}Current user: $USER${NC}"
echo -e "${BLUE}Home directory: $HOME${NC}"
echo ""

# Verify public IP
echo -e "${YELLOW}Checking public IP...${NC}"
PUBLIC_IP=$(curl -s https://api.ipify.org)
EXPECTED_IP="13.211.226.114"

if [ "$PUBLIC_IP" = "$EXPECTED_IP" ]; then
    echo -e "${GREEN}✅ Public IP verified: $PUBLIC_IP${NC}"
else
    echo -e "${RED}❌ IP mismatch! Expected: $EXPECTED_IP, Got: $PUBLIC_IP${NC}"
    echo -e "${YELLOW}⚠️  Continuing anyway, but Tourplan API may not work${NC}"
fi
echo ""

# Update system packages
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y
echo -e "${GREEN}✅ System packages updated${NC}"
echo ""

# Install Node.js 18.x
echo -e "${YELLOW}Installing Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ NPM installed: $NPM_VERSION${NC}"
echo ""

# Install Git
echo -e "${YELLOW}Installing Git...${NC}"
sudo apt install git -y
GIT_VERSION=$(git --version)
echo -e "${GREEN}✅ Git installed: $GIT_VERSION${NC}"
echo ""

# Install other useful tools
echo -e "${YELLOW}Installing additional tools...${NC}"
sudo apt install -y curl wget unzip htop nano vim
echo -e "${GREEN}✅ Additional tools installed${NC}"
echo ""

# Install PM2 for process management
echo -e "${YELLOW}Installing PM2 for process management...${NC}"
sudo npm install -g pm2
PM2_VERSION=$(pm2 --version)
echo -e "${GREEN}✅ PM2 installed: $PM2_VERSION${NC}"
echo ""

# Create project directory
echo -e "${YELLOW}Creating project directory...${NC}"
mkdir -p ~/projects
cd ~/projects
echo -e "${GREEN}✅ Project directory created: ~/projects${NC}"
echo ""

# Set up Git configuration (optional)
echo -e "${YELLOW}Setting up Git configuration...${NC}"
echo "Enter your Git username (or press Enter to skip):"
read -r GIT_USERNAME
if [ -n "$GIT_USERNAME" ]; then
    git config --global user.name "$GIT_USERNAME"
    echo -e "${GREEN}✅ Git username set: $GIT_USERNAME${NC}"
fi

echo "Enter your Git email (or press Enter to skip):"
read -r GIT_EMAIL
if [ -n "$GIT_EMAIL" ]; then
    git config --global user.email "$GIT_EMAIL"
    echo -e "${GREEN}✅ Git email set: $GIT_EMAIL${NC}"
fi
echo ""

# Test Tourplan API connection
echo -e "${YELLOW}Testing Tourplan API connection...${NC}"
TOURPLAN_API_URL="https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
AGENT_ID="SAMAGT"
PASSWORD="S@MAgt01"

XML_REQUEST='<?xml version="1.0"?><!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd"><Request><AgentInfoRequest><AgentID>'$AGENT_ID'</AgentID><Password>'$PASSWORD'</Password><ReturnAccountInfo>Y</ReturnAccountInfo></AgentInfoRequest></Request>'

echo "Making API request to Tourplan..."
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/xml" \
  -H "Accept: application/xml" \
  -H "User-Agent: Tourplan-Booking-Engine/1.0" \
  -d "$XML_REQUEST" \
  "$TOURPLAN_API_URL")

if echo "$RESPONSE" | grep -q "<AgentInfoReply>"; then
    echo -e "${GREEN}✅ Tourplan API connection successful!${NC}"
    echo -e "${GREEN}✅ Your IP ($PUBLIC_IP) is whitelisted${NC}"
elif echo "$RESPONSE" | grep -q "<ErrorReply>"; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '<Error>.*</Error>' | sed 's/<[^>]*>//g')
    echo -e "${RED}❌ Tourplan API error: $ERROR_MSG${NC}"
    if echo "$ERROR_MSG" | grep -qi "ip\|whitelist\|access"; then
        echo -e "${YELLOW}⚠️  Your IP ($PUBLIC_IP) may not be whitelisted${NC}"
        echo -e "${YELLOW}⚠️  Contact Tourplan support to whitelist this IP${NC}"
    fi
else
    echo -e "${RED}❌ Unexpected response from Tourplan API${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Install Nginx (optional)
echo -e "${YELLOW}Do you want to install Nginx? (y/n):${NC}"
read -r INSTALL_NGINX
if [ "$INSTALL_NGINX" = "y" ] || [ "$INSTALL_NGINX" = "Y" ]; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo -e "${GREEN}✅ Nginx installed and started${NC}"
    echo -e "${BLUE}You can access the default page at: http://$PUBLIC_IP${NC}"
fi
echo ""

# Setup complete
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 EC2 SETUP COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo -e "${GREEN}✅ System updated${NC}"
echo -e "${GREEN}✅ Node.js $NODE_VERSION installed${NC}"
echo -e "${GREEN}✅ NPM $NPM_VERSION installed${NC}"
echo -e "${GREEN}✅ Git installed${NC}"
echo -e "${GREEN}✅ PM2 installed${NC}"
echo -e "${GREEN}✅ Project directory created${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${BLUE}1. Clone your project:${NC}"
echo "   git clone https://github.com/your-username/tourplan-booking-engine.git"
echo "   cd tourplan-booking-engine"
echo ""
echo -e "${BLUE}2. Install dependencies:${NC}"
echo "   npm install"
echo ""
echo -e "${BLUE}3. Set up environment variables:${NC}"
echo "   cp .env.example .env"
echo "   nano .env"
echo ""
echo -e "${BLUE}4. Build and start:${NC}"
echo "   npm run build"
echo "   npm start"
echo ""
echo -e "${BLUE}5. Or use PM2 for production:${NC}"
echo "   pm2 start npm --name 'tourplan-booking' -- start"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo -e "${GREEN}Your server is ready! 🚀${NC}"
