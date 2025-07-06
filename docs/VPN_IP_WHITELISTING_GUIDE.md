# 🌐 VPN & IP Whitelisting Guide for Tourplan API

## 🚨 Critical Issue: VPN vs Static IP Conflict

### The Problem
You have a **static IP address** that is whitelisted with Tourplan, but connecting to a VPN (especially South Africa) will **change your IP address** and cause you to lose access to the Tourplan API.

### Current Situation
- ✅ Your static IP is whitelisted with Tourplan
- ❌ Connecting to South Africa VPN changes your IP
- ❌ Changed IP = Lost API access

## 🎯 Recommended Solutions

### Option 1: Request South African Static IP (Recommended)
**Contact NordVPN Support:**
1. Explain you need your static IP changed to a South African location
2. Provide your current static IP details
3. Request the new SA static IP be whitelisted with Tourplan
4. Update your Tourplan configuration with the new IP

**Benefits:**
- ✅ Maintains static IP (consistent access)
- ✅ South African location (if required by Tourplan)
- ✅ No connection issues

### Option 2: Keep Current Static IP (Easiest)
**If your current IP works:**
1. Continue using your current static IP
2. Do NOT connect to South Africa VPN
3. Test API access with current setup

**Benefits:**
- ✅ No changes needed
- ✅ Immediate testing capability
- ✅ No VPN complications

### Option 3: Request Additional IP Whitelisting
**Contact Tourplan:**
1. Ask them to whitelist your current static IP (if not already done)
2. Explain your testing requirements
3. Request confirmation of whitelisted IPs

## 🧪 Testing Your Current Setup

### Step 1: Check Your Current IP
\`\`\`bash
python verify_ip.py
\`\`\`

### Step 2: Test API Connectivity
\`\`\`bash
python test_tourplan_api.py
\`\`\`

### Step 3: Use Web Dashboard
Visit: `http://localhost:3000/api-testing`

## ⚠️ What NOT to Do

### ❌ Don't Connect to South Africa VPN
- This will change your IP address
- You'll lose access to Tourplan API
- Your static IP whitelisting becomes useless

### ❌ Don't Use Regular VPN Servers
- Only use your static IP
- Regular VPN servers have dynamic IPs
- Dynamic IPs are not whitelisted

## 🔍 Troubleshooting

### If API Calls Fail:
1. **Check your current IP:** `python verify_ip.py`
2. **Verify it matches your static IP**
3. **Ensure no VPN is connected**
4. **Test with mock data first:** Set `USE_MOCKS=true`

### If You Need South African IP:
1. **Contact NordVPN support**
2. **Request static IP change to South Africa**
3. **Get new IP whitelisted with Tourplan**
4. **Update your configuration**

## 📞 Contact Information

### NordVPN Support
- **Website:** https://nordvpn.com/contact/
- **Request:** "Change my static IP to South African location"
- **Provide:** Current static IP, reason for change

### Tourplan Support
- **Request:** IP whitelisting for new static IP
- **Provide:** New South African static IP address

## 🎯 Recommended Workflow

### For Immediate Testing:
1. ✅ Use current static IP
2. ✅ Test with mock data (`USE_MOCKS=true`)
3. ✅ Use web dashboard: `http://localhost:3000/api-testing`
4. ✅ Verify all endpoints work with mock data

### For Production Testing:
1. 📞 Contact NordVPN for SA static IP
2. 📞 Get new IP whitelisted with Tourplan
3. 🔧 Update configuration
4. ✅ Test with live API (`USE_MOCKS=false`)

## 🚀 Quick Commands

\`\`\`bash
# Check current IP and status
python verify_ip.py

# Test authentication with current IP
python test_tourplan_api.py

# Run comprehensive tests
python test_tourplan_complete.py

# Open web dashboard
# Visit: http://localhost:3000/api-testing
\`\`\`

## 📋 Checklist

### Before Contacting Support:
- [ ] Document your current static IP
- [ ] Test current API access
- [ ] Determine if SA location is actually required
- [ ] Prepare justification for IP change request

### After Getting New IP:
- [ ] Update Tourplan whitelist
- [ ] Test API connectivity
- [ ] Update documentation
- [ ] Verify all endpoints work

---

💡 **Key Takeaway:** Your static IP is valuable - don't lose it by connecting to VPN unless you have a replacement South African static IP ready.
