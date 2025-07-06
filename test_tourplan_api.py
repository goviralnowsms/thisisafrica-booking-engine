#!/usr/bin/env python3
"""
Tourplan API Testing Script
This script tests authentication and basic API functionality with the Tourplan HostConnect API.
"""

import requests
from xml.dom import minidom
import re

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

def test_tourplan_authentication():
    """Test Authentication & Agent Info (with version 5 DTD)"""
    
    print("=" * 60)
    print("TOURPLAN API AUTHENTICATION TEST")
    print("=" * 60)
    
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

    print("=== TEST 1: AUTHENTICATION (VERSION 5 DTD) ===")
    print(f"\nAPI Endpoint: {API_BASE_URL}")
    print(f"Agent ID: {AGENT_ID}")
    print(f"Password: {'*' * len(PASSWORD)}")
    print("\nSending Request:")
    print(pretty_print_xml(xml_request))
    print("-" * 50)

    try:
        response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)

        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print("\nResponse:")
        print(pretty_print_xml(response.text))

        # Check if response contains ErrorReply
        if "<ErrorReply>" in response.text:
            print("\n❌ Authentication failed - API returned an error")
            # Extract the error message
            error_match = re.search(r'<Error>(.*?)</Error>', response.text)
            if error_match:
                print(f"Error: {error_match.group(1)}")
        elif "<AgentInfoReply>" in response.text:
            print("\n✅ Authentication successful!")
            print("🎉 Agent info retrieved successfully!")
            
            # Extract agent info if available
            agent_name_match = re.search(r'<AgentName>(.*?)</AgentName>', response.text)
            if agent_name_match:
                print(f"Agent Name: {agent_name_match.group(1)}")
                
        elif response.status_code == 200:
            print("\n✅ Request successful - check response content")
        else:
            print(f"\n❌ Authentication failed with status: {response.status_code}")

    except requests.exceptions.Timeout:
        print("❌ Request timed out - API may be slow or unavailable")
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - check your internet connection and VPN")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error making request: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

    print("=" * 60)

def test_basic_connectivity():
    """Test basic connectivity to the API endpoint"""
    
    print("\n=== BASIC CONNECTIVITY TEST ===")
    
    try:
        # Simple GET request to check if endpoint is reachable
        response = requests.get(API_BASE_URL, timeout=10)
        print(f"✅ API endpoint is reachable")
        print(f"Status Code: {response.status_code}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot reach API endpoint: {e}")

if __name__ == "__main__":
    print("Starting Tourplan API Tests...")
    print("Make sure your VPN is connected!")
    print()
    
    # Test basic connectivity first
    test_basic_connectivity()
    
    # Test authentication
    test_tourplan_authentication()
    
    print("\nTourplan API testing complete!")
