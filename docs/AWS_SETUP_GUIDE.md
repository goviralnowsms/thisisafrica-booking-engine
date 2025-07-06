# AWS EC2 Setup Guide for Tourplan Booking Engine

This guide helps you set up your AWS EC2 instance to work with the Tourplan API using the whitelisted IP address.

## Overview

- **Your Local IP**: 110.175.119.93 (for SSH access)
- **Whitelisted IP**: 13.210.224.119 (for Tourplan API)
- **Goal**: SSH from local → EC2 instance → Tourplan API

## Quick Setup

### 1. Configure Security Group
\`\`\`bash
# Add your local IP for SSH access
bash scripts/setup-ec2-security-group.sh
\`\`\`

### 2. Associate Whitelisted IP
\`\`\`bash
# Associate the whitelisted Elastic IP with your instance
bash scripts/associate-elastic-ip.sh
\`\`\`

### 3. Connect to Instance
\`\`\`bash
# Helper script to connect via SSH
bash scripts/connect-to-ec2.sh
\`\`\`

## Detailed Steps

### Step 1: Security Group Configuration

Your EC2 instance needs to allow:
- SSH (port 22) from your local IP: 110.175.119.93
- HTTP (port 80) from anywhere (for web traffic)
- HTTPS (port 443) from anywhere (for web traffic)
- Port 3000 from your local IP (for development)

\`\`\`bash
# Run the security group setup script
bash scripts/setup-ec2-security-group.sh
\`\`\`

This script will:
- Find your EC2 instance
- Add SSH rule for your local IP
- Add web traffic rules
- Show current security group configuration

### Step 2: Elastic IP Association

The Tourplan API requires requests to come from IP 13.210.224.119. You need to associate this Elastic IP with your EC2 instance.

\`\`\`bash
# Run the Elastic IP association script
bash scripts/associate-elastic-ip.sh
\`\`\`

This script will:
- Find the Elastic IP 13.210.224.119
- Associate it with your chosen EC2 instance
- Verify the association worked

### Step 3: SSH Connection

Once the security group and Elastic IP are configured:

\`\`\`bash
# Use the connection helper
bash scripts/connect-to-ec2.sh
\`\`\`

Or connect manually:
\`\`\`bash
ssh -i ~/.ssh/your-key.pem ubuntu@13.210.224.119
\`\`\`

### Step 4: Deploy Application

Once connected to your EC2 instance:

\`\`\`bash
# Clone your repository
git clone https://github.com/your-username/tourplan-booking-engine.git
cd tourplan-booking-engine

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the application
npm run dev
\`\`\`

## Verification

### Check IP Status
\`\`\`bash
# From your EC2 instance, check the API endpoint
curl http://localhost:3000/api/check-ip-status
\`\`\`

### Test Tourplan Connection
\`\`\`bash
# Test the Tourplan API directly
curl http://localhost:3000/api/test-tourplan
\`\`\`

## Troubleshooting

### SSH Connection Issues

**Problem**: Can't SSH to the instance
**Solutions**:
1. Check security group allows SSH from 110.175.119.93
2. Verify key file permissions: `chmod 400 ~/.ssh/your-key.pem`
3. Confirm instance is running
4. Try using the instance's public DNS name instead of IP

### Elastic IP Issues

**Problem**: Can't associate the whitelisted IP
**Solutions**:
1. Check if IP exists in AWS Console → EC2 → Elastic IPs
2. Verify you're in the correct AWS region
3. Check if IP is associated with another instance
4. Contact AWS support if IP was released

### API Connection Issues

**Problem**: Tourplan API returns errors
**Solutions**:
1. Verify you're making requests from the whitelisted IP
2. Check environment variables for Tourplan credentials
3. Test network connectivity: `curl https://pa-thisis.nx.tourplan.net`
4. Check Tourplan API documentation for changes

## Network Flow

\`\`\`
Your Computer (110.175.119.93)
    ↓ SSH
EC2 Instance (13.210.224.119)
    ↓ HTTPS
Tourplan API Servers
\`\`\`

## Security Notes

- Your local IP (110.175.119.93) is only used for SSH access
- The whitelisted IP (13.210.224.119) is used for all Tourplan API calls
- Never expose Tourplan credentials in client-side code
- Use environment variables for sensitive configuration

## Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `setup-ec2-security-group.sh` | Configure security group rules | `bash scripts/setup-ec2-security-group.sh` |
| `associate-elastic-ip.sh` | Associate whitelisted IP | `bash scripts/associate-elastic-ip.sh` |
| `connect-to-ec2.sh` | SSH connection helper | `bash scripts/connect-to-ec2.sh` |

## Environment Variables

Required environment variables for your EC2 instance:

\`\`\`env
# Tourplan API Configuration
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
TOURPLAN_AGENT_ID=your_agent_id
TOURPLAN_PASSWORD=your_password
TOURPLAN_USERNAME=your_username

# Application Configuration
NEXT_PUBLIC_APP_URL=http://13.210.224.119:3000
APP_URL=http://13.210.224.119:3000

# Database (if using)
NEON_DATABASE_URL=your_database_url
\`\`\`

## Next Steps

1. ✅ Configure security group for SSH access
2. ✅ Associate whitelisted Elastic IP
3. ✅ SSH into your EC2 instance
4. ✅ Deploy the Tourplan booking engine
5. ✅ Test API connectivity
6. 🚀 Start accepting bookings!
