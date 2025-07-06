# EC2 Setup Guide for Tourplan Booking Engine

This guide will help you deploy the Tourplan booking engine on an Amazon EC2 instance.

## Prerequisites

- AWS Account with EC2 access
- Basic knowledge of Linux/Ubuntu
- Your Tourplan API credentials
- Domain name (optional but recommended)

## Step 1: Launch EC2 Instance

1. **Launch Instance:**
   - Go to AWS EC2 Console
   - Click "Launch Instance"
   - Choose Ubuntu Server 22.04 LTS (Free Tier eligible)
   - Instance type: t3.micro or t3.small (minimum)
   - Create or select a key pair for SSH access

2. **Security Group Configuration:**
   \`\`\`
   Inbound Rules:
   - SSH (22): Your IP address
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom TCP (3000): 0.0.0.0/0 (for development)
   \`\`\`

3. **Storage:**
   - Minimum 20GB GP3 storage

## Step 2: Connect to Your Instance

\`\`\`bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update the system
sudo apt update && sudo apt upgrade -y
\`\`\`

## Step 3: Install Dependencies

\`\`\`bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
\`\`\`

## Step 4: Clone and Setup Application

\`\`\`bash
# Clone your repository
git clone https://github.com/your-username/tourplan-booking-engine.git
cd tourplan-booking-engine

# Install dependencies
npm install

# Build the application
npm run build
\`\`\`

## Step 5: Environment Configuration

\`\`\`bash
# Create environment file
nano .env.local
\`\`\`

Add your environment variables:
\`\`\`env
# Tourplan API Configuration
TOURPLAN_API_URL=https://your-tourplan-api-url
TOURPLAN_USERNAME=your-username
TOURPLAN_PASSWORD=your-password
TOURPLAN_AGENT_ID=your-agent-id

# Database (your Neon database)
NEON_NEON_DATABASE_URL=postgres://neondb_owner:npg_Jv70lWKrNcBM@ep-proud-queen-a7v9ufhk-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require

# App URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
APP_URL=https://your-domain.com

# Email Configuration (optional)
RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@your-domain.com

# Stripe Configuration (optional)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
\`\`\`

## Step 6: Get Your EC2 Public IP

\`\`\`bash
# Get your public IP address
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Or use external service
curl https://api.ipify.org
\`\`\`

**Important:** Contact Tourplan support to whitelist this IP address for API access.

## Step 7: Start the Application

\`\`\`bash
# Start with PM2
pm2 start npm --name "tourplan-booking" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
\`\`\`

## Step 8: Configure Nginx (Optional but Recommended)

\`\`\`bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/tourplan-booking
\`\`\`

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
