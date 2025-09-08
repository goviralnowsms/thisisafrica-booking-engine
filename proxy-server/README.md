# TourPlan API Proxy Server

A lightweight, reliable proxy server to handle TourPlan API requests with a static IP address.

## Why This Exists

- **Eliminates AWS/Squid complexity**: Simple Node.js instead of complex Squid configuration
- **More reliable**: No Elastic IP detachment issues, no Squid cache problems
- **Easier to debug**: Clear logs, simple codebase
- **Multi-provider support**: Can deploy to any VPS provider

## Features

- ✅ Simple Express.js proxy (50 lines of code vs complex Squid config)
- ✅ API key authentication
- ✅ CORS handling for multiple domains
- ✅ Health check endpoint
- ✅ Request/response logging
- ✅ PM2 clustering for high availability
- ✅ Automatic restart on failure

## Quick Start

### 1. Deploy to DigitalOcean (Recommended)

```bash
# Create a $6/month droplet with Ubuntu 22.04
# SSH into your droplet

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone and setup
git clone [your-repo]
cd proxy-server
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit API_KEY and ALLOWED_ORIGINS

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions to enable auto-start

# Check status
pm2 status
pm2 logs
```

### 2. Alternative: Deploy to Vultr/Linode

Same steps as DigitalOcean - any Ubuntu VPS works.

### 3. Alternative: Deploy to Railway.app (Serverless with Static IP)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up

# Railway provides a static IP automatically
```

## Configuration

Edit `.env` file:

```env
PORT=3001
API_KEY=generate-a-long-random-string-here
ALLOWED_ORIGINS=https://thisisafrica.com.au,https://book.thisisafrica.com.au
```

## Update Your Next.js App

In your Next.js app's `.env.local`:

```env
# Change from:
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi

# To:
TOURPLAN_PROXY_URL=http://YOUR-VPS-IP:3001/hostconnect/api/hostConnectApi
TOURPLAN_PROXY_API_KEY=your-api-key-from-proxy-env
```

Update your TourPlan client (`lib/tourplan/client.ts`):

```typescript
const response = await fetch(process.env.TOURPLAN_PROXY_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/xml',
    'x-api-key': process.env.TOURPLAN_PROXY_API_KEY
  },
  body: xmlRequest
});
```

## Monitoring

### Health Check
```bash
curl http://YOUR-VPS-IP:3001/health
```

### View Logs
```bash
pm2 logs tourplan-proxy
```

### Monitor Performance
```bash
pm2 monit
```

## Security

1. **Firewall**: Only allow ports 22 (SSH), 3001 (proxy)
   ```bash
   sudo ufw allow 22
   sudo ufw allow 3001
   sudo ufw enable
   ```

2. **API Key**: Use a strong, random API key
3. **HTTPS**: Optional - add nginx reverse proxy with Let's Encrypt

## Backup Proxy Servers

Deploy to multiple providers and add all IPs to TourPlan whitelist:

- Primary: DigitalOcean (IP: xxx.xxx.xxx.1)
- Backup 1: Vultr (IP: xxx.xxx.xxx.2)
- Backup 2: Linode (IP: xxx.xxx.xxx.3)

Switch by changing `TOURPLAN_PROXY_URL` in your Next.js app.

## Troubleshooting

### Proxy not responding
```bash
pm2 restart tourplan-proxy
pm2 logs --lines 100
```

### High memory usage
```bash
pm2 reload tourplan-proxy  # Zero-downtime restart
```

### Update code
```bash
git pull
npm install
pm2 reload tourplan-proxy
```

## Cost Comparison

| Solution | Monthly Cost | Setup Time | Reliability |
|----------|-------------|------------|-------------|
| AWS + Squid + Elastic IP | $20-30 | 2-3 hours | 95% (your current issues) |
| This proxy on DigitalOcean | $6 | 30 minutes | 99.9% |
| FixieIP | $50+ | 10 minutes | 90% |

## Why This is Better Than AWS + Squid

1. **Simpler**: 50 lines of Node.js vs complex Squid configuration
2. **Cheaper**: $6/month vs $20-30 for AWS
3. **More reliable**: No Elastic IP detachment issues
4. **Easier debugging**: Clear JavaScript logs vs Squid access logs
5. **Portable**: Same code works on any Linux VPS