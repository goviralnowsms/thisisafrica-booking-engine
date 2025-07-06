# Tourplan IP Whitelist Request

## Your EC2 Static IP Address
**13.210.224.119**

## Email Template for Tourplan Support

Subject: IP Whitelist Request for HostConnect SOAP Search API - thisisafrica.com.au

Dear Tourplan Support Team,

I am writing to request IP whitelisting for our booking engine integration with the Tourplan HostConnect API.

**Details:**
- Website: thisisafrica.com.au
- Agent ID: [YOUR_AGENT_ID]
- Static IP Address: **13.210.224.119**
- AWS Region: ap-southeast-2 (Sydney)

**Request:**
Please whitelist IP address **13.210.224.119** for access to the HostConnect SOAP Search API endpoint. This IP will be used for all API requests from our booking engine.

**Current Status:**
- HostConnect XML API: Working ✅
- SOAP Search API: Access Denied (IP not whitelisted) ❌

**Technical Setup:**
We are using an AWS EC2 instance with an Elastic IP (13.210.224.119) to ensure consistent outbound IP addressing for API requests.

**APIs We Need Access To:**
- OptionInfoRequest (SOAP Search API)
- General Search functionality
- Availability checking
- Booking creation

Please confirm once the IP has been whitelisted so we can proceed with testing.

Thank you for your assistance.

Best regards,
[Your Name]
[Your Contact Information]

---

## Next Steps After Whitelisting

1. **Test Sandbox API** - Verify the IP whitelist is working
2. **Get Production Credentials** - Request production API details
3. **Update Environment Variables** - Switch from sandbox to production
4. **Test Production API** - Verify everything works in production
5. **Go Live** - Enable real bookings

## Environment Variables for Production

\`\`\`
TOURPLAN_API_URL=https://[PRODUCTION_URL]
TOURPLAN_USERNAME=[PRODUCTION_USERNAME]  
TOURPLAN_PASSWORD=[PRODUCTION_PASSWORD]
TOURPLAN_AGENT_ID=[PRODUCTION_AGENT_ID]
TOURPLAN_PROXY_URL=[YOUR_EC2_PROXY_URL_IF_USING_PROXY]
USE_TOURPLAN_PROXY=false
\`\`\`

**Note:** Since you're now using EC2 directly, you may not need the proxy anymore. You can make direct requests from your EC2 instance to Tourplan's API once the IP is whitelisted.

## EC2 Direct Integration

With EC2, you have two options:

### Option 1: Direct API Calls (Recommended)
- Set `USE_TOURPLAN_PROXY=false`
- Make direct HTTPS requests from EC2 to Tourplan
- Simpler setup, fewer moving parts

### Option 2: Keep Using Proxy
- Set `USE_TOURPLAN_PROXY=true`
- Continue using your existing Lambda proxy
- Useful if you want to keep the proxy for logging/monitoring

## Testing Your New IP

You can verify your EC2's outbound IP by running:
\`\`\`bash
curl https://api.ipify.org
\`\`\`

This should return: **13.210.224.119**
