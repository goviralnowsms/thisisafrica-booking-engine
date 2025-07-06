#!/usr/bin/env python3
"""
Test connection with whitelisted IP for Tourplan API
Run this after associating the whitelisted IP with your EC2 instance
"""

import requests
import time
from datetime import datetime

# Configuration
WHITELISTED_IP = "13.210.224.119"
YOUR_LOCAL_IP = "110.175.119.93"
TOURPLAN_API_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
AGENT_ID = "SAMAGT"
PASSWORD = "S@MAgt01"

def check_current_ip():
    """Check what IP we're currently using"""
    try:
        # Check from multiple sources
        sources = [
            "https://api.ipify.org",
            "https://httpbin.org/ip",
            "https://icanhazip.com"
        ]
        
        ips = []
        for source in sources:
            try:
                if "httpbin" in source:
                    response = requests.get(source, timeout=5)
                    ip = response.json()['origin']
                else:
                    response = requests.get(source, timeout=5)
                    ip = response.text.strip()
                ips.append(ip)
                print(f"✅ {source}: {ip}")
            except Exception as e:
                print(f"❌ {source}: Failed - {e}")
        
        # Check EC2 metadata (if on EC2)
        try:
            ec2_response = requests.get(
                "http://169.254.169.254/latest/meta-data/public-ipv4", 
                timeout=2
            )
            ec2_ip = ec2_response.text.strip()
            print(f"✅ EC2 Metadata: {ec2_ip}")
            ips.append(ec2_ip)
        except:
            print("ℹ️  Not on EC2 or metadata not accessible")
        
        # Return most common IP
        if ips:
            most_common = max(set(ips), key=ips.count)
            return most_common
        return None
        
    except Exception as e:
        print(f"❌ IP check failed: {e}")
        return None

def test_tourplan_auth():
    """Test Tourplan authentication with current IP"""
    print("\n🔐 Testing Tourplan Authentication...")
    
    xml_request = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <AgentInfoRequest>
        <AgentID>{AGENT_ID}</AgentID>
        <Password>{PASSWORD}</Password>
        <ReturnAccountInfo>Y</ReturnAccountInfo>
    </AgentInfoRequest>
</Request>"""

    headers = {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
    }

    try:
        start_time = time.time()
        response = requests.post(
            TOURPLAN_API_URL, 
            data=xml_request, 
            headers=headers, 
            timeout=30
        )
        response_time = int((time.time() - start_time) * 1000)

        print(f"📡 Response received ({response_time}ms)")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ HTTP Error: {response.status_code}")
            return False

        response_text = response.text
        
        if "<ErrorReply>" in response_text:
            # Extract error details
            import re
            error_match = re.search(r'<Error>(.*?)</Error>', response_text)
            error_msg = error_match.group(1) if error_match else "Unknown error"
            
            print(f"❌ Authentication Failed: {error_msg}")
            
            if "2050" in error_msg or "IP" in error_msg.upper():
                print("🚫 IP WHITELIST ISSUE!")
                print("💡 Your current IP is not whitelisted.")
                return False
            
            return False
            
        elif "<AgentInfoReply>" in response_text:
            print(f"✅ Authentication Successful!")
            print(f"🎉 IP IS WHITELISTED and working!")
            return True
            
        else:
            print(f"❓ Unexpected response format")
            return False

    except requests.exceptions.Timeout:
        print(f"⏰ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def main():
    print("🧪 WHITELISTED IP CONNECTION TEST")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now()}")
    print(f"🎯 Expected IP: {WHITELISTED_IP}")
    print(f"🏠 Your Local IP: {YOUR_LOCAL_IP}")
    print("=" * 50)
    
    # Check current IP
    print("\n🌐 Checking current public IP...")
    current_ip = check_current_ip()
    
    if not current_ip:
        print("❌ Could not determine current IP")
        return
    
    print(f"\n📍 Current Public IP: {current_ip}")
    
    # Check if we have the whitelisted IP
    if current_ip == WHITELISTED_IP:
        print("✅ SUCCESS: You have the whitelisted IP!")
        print("🎯 This should work with Tourplan API.")
    else:
        print(f"⚠️  WARNING: Current IP ({current_ip}) != Whitelisted IP ({WHITELISTED_IP})")
        print("❌ This may not work with Tourplan API.")
        print("\nPossible issues:")
        print("1. Elastic IP not properly associated")
        print("2. Using wrong network interface")
        print("3. Behind NAT/proxy")
    
    # Test Tourplan connection regardless
    auth_success = test_tourplan_auth()
    
    print("\n" + "=" * 50)
    print("🎯 FINAL RESULT:")
    
    if current_ip == WHITELISTED_IP and auth_success:
        print("🎉 PERFECT: Correct IP + Tourplan API working!")
        print("✅ You're ready to use the booking engine.")
    elif current_ip == WHITELISTED_IP and not auth_success:
        print("⚠️  PARTIAL: Correct IP but Tourplan auth failed")
        print("🔧 Check Tourplan credentials or API endpoint.")
    elif current_ip != WHITELISTED_IP and auth_success:
        print("🤔 UNEXPECTED: Wrong IP but Tourplan working")
        print("💡 Maybe multiple IPs are whitelisted?")
    else:
        print("❌ FAILED: Wrong IP and Tourplan not working")
        print("🔧 Need to fix IP association and/or whitelist.")
    
    print("=" * 50)
    
    if current_ip != WHITELISTED_IP:
        print("\n📋 Next Steps:")
        print("1. Run: bash scripts/associate-whitelisted-ip.sh")
        print("2. Check AWS Console → EC2 → Elastic IPs")
        print("3. Contact AWS Support if IP is not available")
        print("4. Contact Tourplan to whitelist new IP if needed")

if __name__ == "__main__":
    main()
