# Security Group Configuration Guide

## Overview

Security groups act as virtual firewalls for your EC2 instances. You need **INBOUND rules** to allow traffic TO your instance.

## Required Inbound Rules

### 1. SSH Access (Port 22)
- **Type**: SSH
- **Protocol**: TCP
- **Port**: 22
- **Source**: Your IP address only (for security)
- **Example**: `203.123.45.67/32` (your static IP)

### 2. HTTP Access (Port 80)
- **Type**: HTTP
- **Protocol**: TCP
- **Port**: 80
- **Source**: `0.0.0.0/0` (anywhere - for web traffic)

### 3. HTTPS Access (Port 443)
- **Type**: HTTPS
- **Protocol**: TCP
- **Port**: 443
- **Source**: `0.0.0.0/0` (anywhere - for secure web traffic)

### 4. Application Access (Port 3000)
- **Type**: Custom TCP
- **Protocol**: TCP
- **Port**: 3000
- **Source**: `0.0.0.0/0` (anywhere - so users can access your app)

## Security Best Practices

### SSH Security
- **Restrict SSH to your IP only**: Use your static business IP
- **Format**: `YOUR_IP/32` (the /32 means exactly that IP)
- **Example**: `203.123.45.67/32`

### Web Traffic
- **Allow from anywhere**: Use `0.0.0.0/0` for ports 80, 443, and 3000
- **Why**: Users need to access your website from any location

## Configuration Steps

1. **Go to EC2 Console → Security Groups**
2. **Select your security group**
3. **Click "Inbound rules" tab**
4. **Edit inbound rules**
5. **Add/modify rules as shown above**

## Example Configuration

\`\`\`
Type        Protocol    Port    Source          Description
SSH         TCP         22      203.123.45.67/32    SSH access from your office
HTTP        TCP         80      0.0.0.0/0           Web traffic
HTTPS       TCP         443     0.0.0.0/0           Secure web traffic  
Custom TCP  TCP         3000    0.0.0.0/0           Application access
\`\`\`

## Outbound Rules

**Default outbound rules are usually fine** - they allow all outbound traffic, which your application needs to:
- Download packages
- Connect to APIs
- Access databases

## Testing Your Configuration

### Test SSH Access
\`\`\`bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
\`\`\`

### Test Web Access
\`\`\`bash
curl http://YOUR_EC2_IP:3000/api/health
\`\`\`

### Test from Browser
Navigate to: `http://YOUR_EC2_IP:3000`

## Troubleshooting

### SSH Connection Refused
- Check if port 22 is open in security group
- Verify your IP address is correct
- Ensure SSH key is correct

### Web App Not Accessible
- Check if port 3000 is open to 0.0.0.0/0
- Verify application is running: `pm2 status`
- Check if app is listening on port 3000: `netstat -tlnp | grep 3000`

### Can't Access from Specific Location
- Security group might be restricting access
- Check if source is set to 0.0.0.0/0 for web ports
- Test from different network/location

## Static IP Benefits

Using your business static IP for SSH provides:
- **Consistent access** - no VPN connection issues
- **Better security** - only your office can SSH
- **Reliable deployment** - no IP changes during deployment
- **Easier troubleshooting** - consistent network path

## IP Address Formats

- **Single IP**: `203.123.45.67/32`
- **IP Range**: `203.123.45.0/24` (entire subnet)
- **Anywhere**: `0.0.0.0/0` (all IPs)

## Security Group vs NACLs

- **Security Groups**: Instance-level firewall (what you're configuring)
- **NACLs**: Subnet-level firewall (usually default is fine)
- **Focus on Security Groups** for EC2 instance access control
