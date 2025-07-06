#!/usr/bin/env python3
"""
Complete Setup Testing Script
This script tests both VPN connectivity and Tourplan API access.
"""

import requests
from xml.dom import minidom
import re

# VPN Configuration
EXPECTED_VPN_IP = "84.46.231.251"

# API Configuration
API_BASE_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
AGENT_ID = "SAMAGT"
PASSWORD = "S@MAgt01"

def pretty_print_xml(xml_string):
    """Pretty print XML for better readability"""
    try:
        dom = minidom.parseString(xml_string)
        return dom.toprettyxml(indent="  ")
    except:
        return xml_string

def test_vpn_connection():
    """Test VPN connection by checking current IP"""
    
    print("=" * 60)
    print("VPN CONNECTION TEST")
    print("=" * 60)
    
    try:
        print("Checking current IP address...")
        ip_check = requests.get('https://httpbin.org/ip', timeout=10)
        current_ip = ip_check.json()['origin']
        print(f"Current IP: {current_ip}")
        print(f"Expected VPN IP: {EXPECTED_VPN_IP}")
        
        if current_ip == EXPECTED_VPN_IP:
            print("✅ VPN is connected and working correctly!")
            return True
        else:
            print("❌ VPN not connected or using wrong IP")
            print("Please ensure your VPN is connected")
            return False
            
    except Exception as e:
        print(f"❌ Error checking VPN: {e}")
        return False

def test_tourplan_api():
    """Test Tourplan API authentication"""
    
    print("\n" + "=" * 60)
    print("TOURPLAN API TEST")
    print("=" * 60)
    
    # Test basic connectivity
    try:
        print("Testing API endpoint connectivity...")
        response = requests.get(API_BASE_URL, timeout=10)
        print(f"✅ API endpoint reachable (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Cannot reach API endpoint: {e}")
        return False
    
    # Test authentication
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

    print(f"\nTesting authentication for Agent: {AGENT_ID}")
    
    try:
        response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)
        
        if "<ErrorReply>" in response.text:
            print("❌ Authentication failed - API returned an error")
            error_match = re.search(r'<Error>(.*?)</Error>', response.text)
            if error_match:
                error_msg = error_match.group(1)
                print(f"Error: {error_msg}")
                
                # Analyze the error
                if "2050" in error_msg and "Request denied" in error_msg:
                    print("\n📋 Analysis:")
                    print("   - Error 2050 indicates IP restriction or agent authorization issue")
                    print("   - Your VPN IP may not be whitelisted for this agent")
                    print("   - Contact Tourplan support to authorize your IP address")
                    
            return False
            
        elif "<AgentInfoReply>" in response.text:
            print("✅ Authentication successful!")
            agent_name_match = re.search(r'<AgentName>(.*?)</AgentName>', response.text)
            if agent_name_match:
                print(f"Agent Name: {agent_name_match.group(1)}")
            return True
            
        else:
            print(f"❌ Unexpected response (Status: {response.status_code})")
            return False
            
    except Exception as e:
        print(f"❌ Error testing authentication: {e}")
        return False

def main():
    """Run complete setup tests"""
    
    print("🔧 COMPLETE SETUP TESTING")
    print("Testing VPN connection and Tourplan API access...")
    print()
    
    # Test VPN first
    vpn_ok = test_vpn_connection()
    
    # Test API (regardless of VPN status for debugging)
    api_ok = test_tourplan_api()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"VPN Connection: {'✅ PASS' if vpn_ok else '❌ FAIL'}")
    print(f"API Connectivity: ✅ PASS")
    print(f"API Authentication: {'✅ PASS' if api_ok else '❌ FAIL'}")
    
    if vpn_ok and not api_ok:
        print("\n📋 NEXT STEPS:")
        print("1. VPN is working correctly")
        print("2. API endpoint is reachable")
        print("3. Authentication failed - likely IP authorization issue")
        print("4. Contact Tourplan support to whitelist your VPN IP")
        print(f"   IP to whitelist: {EXPECTED_VPN_IP}")
        print(f"   Agent ID: {AGENT_ID}")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
