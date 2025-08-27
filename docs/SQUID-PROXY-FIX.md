# Squid Proxy Fix Documentation

## Issue Summary
Production API searches fail with "whitelisted IP address" errors despite working locally. This happens when the EC2 instance running Squid proxy becomes unreachable or corrupted.

## Quick Diagnostic
1. Check proxy status: https://book.thisisafrica.com.au/api/test-ip
2. Look for: `tourplanApiReachable: true` and `isUsingProxy: true`
3. If false, the proxy needs fixing

## Solution: Create New EC2 Instance with Squid

### Step 1: Create New EC2 Instance
1. Go to AWS EC2 Console → Launch Instance
2. Settings:
   - Name: `squid-proxy-[date]`
   - AMI: **Ubuntu Server 22.04 LTS** (free tier)
   - Instance type: **t2.micro** or **t3.micro**
   - Key pair: Create new (name: `squid-proxy-key-[date]`)
     - Type: RSA, Format: .pem
     - **Download and save the .pem file**
   - Network settings:
     - ✅ **Auto-assign public IP: ENABLE** (CRITICAL!)
   - Security Group (create new or use existing):
     - SSH (22) - Source: 0.0.0.0/0 (for EC2 Instance Connect)
     - HTTP (80) - Source: 0.0.0.0/0
     - HTTPS (443) - Source: 0.0.0.0/0
     - Custom TCP (3128) - Source: 0.0.0.0/0 (proxy port)
3. Launch instance

### Step 2: Move Elastic IP to New Instance
1. Go to EC2 → Elastic IPs
2. Select IP **13.210.224.119**
3. Actions → Disassociate Elastic IP (from old instance)
4. Actions → Associate Elastic IP
5. Select your new instance → Associate

### Step 3: Connect to Instance
**Option A - EC2 Instance Connect (easier):**
1. Select instance → Connect → EC2 Instance Connect
2. Keep username as "ubuntu" → Connect

**Option B - SSH from PowerShell (if Instance Connect fails):**
```powershell
# Fix key permissions first
icacls "D:\your-key.pem" /inheritance:r /grant:r "%USERNAME%:R"

# Remove old host key if needed
ssh-keygen -R 13.210.224.119

# Connect
ssh -i "D:\your-key.pem" ubuntu@13.210.224.119
```

### Step 4: Install and Configure Squid
Run these commands in order:

```bash
# Update and install Squid
sudo apt update && sudo apt install -y squid

# Create minimal config (use echo commands to avoid EOF issues)
sudo bash -c 'echo "http_access allow all" > /etc/squid/squid.conf'
sudo bash -c 'echo "http_port 3128" >> /etc/squid/squid.conf'
sudo bash -c 'echo "forwarded_for delete" >> /etc/squid/squid.conf'
sudo bash -c 'echo "via off" >> /etc/squid/squid.conf'
sudo bash -c 'echo "cache deny all" >> /etc/squid/squid.conf'

# Restart Squid (use full path if sudo acts weird)
/usr/bin/sudo systemctl restart squid

# Check status
/usr/bin/sudo systemctl status squid | grep Active
```

Should show: `Active: active (running)`

### Step 5: Verify It Works
1. Go to: https://book.thisisafrica.com.au/api/test-ip
2. Should show:
   - `proxyType: "EC2"`
   - `isUsingProxy: true`
   - `tourplanApiReachable: true`
   - `outboundIp: "13.210.224.119"`
3. Test actual searches on the booking site

## Common Issues & Solutions

### "sudo: command not found" in terminal
- Use full path: `/usr/bin/sudo` instead of just `sudo`
- Or reconnect to get fresh session

### EC2 Instance Connect fails
- Edit Security Group SSH rule: change source to 0.0.0.0/0
- Or use SSH directly with .pem key

### Permission denied with SSH key
- Windows PowerShell: `icacls "D:\key.pem" /inheritance:r /grant:r "%USERNAME%:R"`
- Remove conflicting host key: `ssh-keygen -R 13.210.224.119`

### HTTP 403 Forbidden from TourPlan
- Ensure Elastic IP is 13.210.224.119 (already whitelisted by TourPlan)
- Check Squid config has `forwarded_for delete` and `via off`

## Important Notes
1. **Always use Elastic IP 13.210.224.119** - This is whitelisted by TourPlan
2. **Don't change PROXY_URL in Vercel** - Keep it as http://13.210.224.119:3128
3. **Save the .pem key securely** - You'll need it for future access
4. **Terminate old instances** after confirming new one works to save costs

## Minimal Working Squid Config
```
http_access allow all
http_port 3128
forwarded_for delete
via off
cache deny all
```

This config:
- Allows all connections
- Removes forwarding headers that TourPlan doesn't like
- Disables caching
- Works reliably with TourPlan API

## Testing Commands
```bash
# Check Squid is running
ps aux | grep squid

# Test proxy locally
curl -x http://localhost:3128 -I https://www.google.com

# Check public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

## When to Use This Fix
- After deployments that break the proxy
- When test-ip shows `tourplanApiReachable: false`
- When searches fail with whitelisted IP errors
- If EC2 instance becomes unresponsive

Last successful fix: August 28, 2024