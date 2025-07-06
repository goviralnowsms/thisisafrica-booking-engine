#!/usr/bin/env python3
"""
Quick IP Whitelist Check for Tourplan Search API
This script tests if your current IP is whitelisted for Tourplan API access.
"""

import requests
import time
from datetime import datetime

# API Configuration
API_BASE_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
AGENT_ID = "SAMAGT"
PASSWORD = "S@MAgt01"

def check_ip_status():
    """Check current IP address"""
    try:
        response = requests.get('https://httpbin.org/ip', timeout=10)
        ip_data = response.json()
        current_ip = ip_data['origin']
        print(f"🌐 Current IP: {current_ip}")
        return current_ip
    except Exception as e:
        print(f"❌ Could not determine IP: {e}")
        return None

def test_tourplan_connectivity():
    """Test basic connectivity to Tourplan API"""
    print("\n🔗 Testing Tourplan API Connectivity...")
    try:
        start_time = time.time()
        response = requests.get(API_BASE_URL, timeout=10)
        response_time = int((time.time() - start_time) * 1000)
        
        print(f"✅ API endpoint reachable (Status: {response.status_code}, {response_time}ms)")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot reach API: {str(e)}")
        return False

def test_tourplan_authentication():
    """Test Tourplan authentication to check IP whitelist"""
    print("\n🔐 Testing Tourplan Authentication (IP Whitelist Check)...")
    
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
        response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)
        response_time = int((time.time() - start_time) * 1000)

        print(f"📡 Response received ({response_time}ms)")
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ HTTP Error: {response.status_code}")
            return False

        response_text = response.text
        print(f"📄 Response length: {len(response_text)} characters")
        
        if "<ErrorReply>" in response_text:
            # Extract error details
            import re
            error_match = re.search(r'<Error>(.*?)</Error>', response_text)
            error_msg = error_match.group(1) if error_match else "Unknown error"
            
            print(f"❌ Authentication Failed: {error_msg}")
            
            # Check for IP-related errors
            if "IP" in error_msg.upper() or "ACCESS" in error_msg.upper() or "UNAUTHORIZED" in error_msg.upper():
                print("🚫 This appears to be an IP whitelist issue!")
                print("💡 Your IP may not be whitelisted for Tourplan API access.")
            
            return False
            
        elif "<AgentInfoReply>" in response_text:
            # Extract agent details
            import re
            agent_name_match = re.search(r'<AgentName>(.*?)</AgentName>', response_text)
            agent_name = agent_name_match.group(1) if agent_name_match else "Unknown"
            
            print(f"✅ Authentication Successful!")
            print(f"👤 Agent: {agent_name}")
            print(f"🎉 Your IP IS WHITELISTED for Tourplan API access!")
            return True
            
        else:
            print(f"❓ Unexpected response format")
            print(f"📝 Response preview: {response_text[:200]}...")
            return False

    except requests.exceptions.Timeout:
        print(f"⏰ Request timed out - this might indicate IP blocking")
        return False
    except requests.exceptions.ConnectionError:
        print(f"🔌 Connection error - check your internet/VPN connection")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def test_search_api():
    """Test a simple search request"""
    print("\n🔍 Testing Search API...")
    
    # Simple OptionInfoRequest for search functionality
    xml_request = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <OptionInfoRequest>
        <AgentID>{AGENT_ID}</AgentID>
        <Password>{PASSWORD}</Password>
        <ButtonName>SEARCH</ButtonName>
        <DestinationName>Cape Town</DestinationName>
        <Info>AVAIL</Info>
    </OptionInfoRequest>
</Request>"""

    headers = {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
    }

    try:
        start_time = time.time()
        response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)
        response_time = int((time.time() - start_time) * 1000)

        print(f"📡 Search response received ({response_time}ms)")
        
        if "<ErrorReply>" in response.text:
            import re
            error_match = re.search(r'<Error>(.*?)</Error>', response.text)
            error_msg = error_match.group(1) if error_match else "Unknown error"
            print(f"❌ Search failed: {error_msg}")
            return False
        elif "<OptionInfoReply>" in response.text:
            print(f"✅ Search API working!")
            print(f"🎯 You can successfully use the Tourplan search API!")
            return True
        else:
            print(f"❓ Unexpected search response")
            return False
            
    except Exception as e:
        print(f"❌ Search test failed: {str(e)}")
        return False

def main():
    """Main function"""
    print("🧪 TOURPLAN IP WHITELIST & SEARCH API CHECK")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now()}")
    print(f"🎯 API Endpoint: {API_BASE_URL}")
    print("=" * 50)
    
    # Check current IP
    current_ip = check_ip_status()
    
    # Test connectivity
    if not test_tourplan_connectivity():
        print("\n❌ RESULT: Cannot reach Tourplan API")
        return
    
    # Test authentication (IP whitelist check)
    auth_success = test_tourplan_authentication()
    
    if auth_success:
        # If auth works, test search functionality
        search_success = test_search_api()
        
        print("\n" + "=" * 50)
        print("🎉 FINAL RESULT:")
        print("✅ Your IP IS WHITELISTED!")
        print("✅ You CAN use the Tourplan search API!")
        if search_success:
            print("✅ Search functionality confirmed working!")
        print("=" * 50)
    else:
        print("\n" + "=" * 50)
        print("❌ FINAL RESULT:")
        print("🚫 Your IP may NOT be whitelisted")
        print("❌ You CANNOT use the Tourplan search API yet")
        print("💡 Contact Tourplan to whitelist your IP:")
        print(f"   Current IP: {current_ip}")
        print("=" * 50)

if __name__ == "__main__":
    main()
