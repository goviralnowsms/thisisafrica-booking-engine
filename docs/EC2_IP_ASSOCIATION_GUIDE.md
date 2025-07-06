# EC2 IP Association Guide - Maintaining Whitelisted IP

This guide helps you associate the whitelisted IP address (13.210.224.119) with your new EC2 instance.

## Current Situation
- **Whitelisted IP**: 13.210.224.119 (approved by Tourplan)
- **Your Local IP**: 110.175.119.93
- **Goal**: Use the whitelisted IP for your new EC2 instance

## Option 1: Elastic IP Association (Recommended)

### Step 1: Check if IP is an Elastic IP
\`\`\`bash
# In AWS Console:
# 1. Go to EC2 → Elastic IPs
# 2. Look for 13.210.224.119
# 3. Check if it's available or associated with another instance
\`\`\`

### Step 2: Associate Elastic IP with New Instance
\`\`\`bash
# If the IP is available as an Elastic IP:
# 1. Go to EC2 → Instances
# 2. Select your new instance
# 3. Actions → Networking → Associate Elastic IP address
# 4. Select 13.210.224.119
# 5. Click Associate
\`\`\`

### Step 3: Verify Association
\`\`\`bash
# SSH into your instance and check:
curl http://169.254.169.254/latest/meta-data/public-ipv4
# Should return: 13.210.224.119
\`\`\`

## Option 2: Launch Instance in Same Subnet/AZ

If the IP was tied to a specific subnet or availability zone:

### Step 1: Find Original Instance Details
\`\`\`bash
# In AWS Console, find the original instance that had 13.210.224.119:
# 1. Go to EC2 → Instances (including terminated)
# 2. Look for instance with IP 13.210.224.119
# 3. Note the Subnet ID and Availability Zone
\`\`\`

### Step 2: Launch New Instance in Same Location
\`\`\`bash
# When launching new instance:
# 1. Choose same VPC
# 2. Choose same Subnet
# 3. Choose same Availability Zone
# 4. In Advanced Details, request specific IP if possible
\`\`\`

## Option 3: Contact AWS Support

If the IP is not available as an Elastic IP:

\`\`\`bash
# Create AWS Support case:
# 1. Go to AWS Support Center
# 2. Create case → Account and billing support
# 3. Subject: "Request to associate specific public IP with new instance"
# 4. Explain you need 13.210.224.119 for business continuity
\`\`\`

## Verification Steps

Once you have the IP associated:

### 1. Check Public IP
\`\`\`bash
# From inside the instance:
curl http://169.254.169.254/latest/meta-data/public-ipv4

# From outside:
curl https://api.ipify.org
\`\`\`

### 2. Test Tourplan Connection
\`\`\`bash
# Run the IP whitelist check:
python3 test_ip_whitelist_check.py
\`\`\`

### 3. Update DNS (if applicable)
\`\`\`bash
# If you have a domain pointing to the old IP:
# Update A record to point to 13.210.224.119
\`\`\`

## Troubleshooting

### IP Not Available
- The IP might be released back to AWS pool
- Contact Tourplan to whitelist your new IP
- Consider using a NAT Gateway for consistent outbound IP

### IP Associated but Not Working
- Check Security Groups
- Verify Route Tables
- Ensure Internet Gateway is attached

### Alternative Solutions
- Use NAT Gateway with Elastic IP
- Set up VPN connection
- Use AWS Client VPN
\`\`\`

Now let's create a script to help you check and associate the IP:
