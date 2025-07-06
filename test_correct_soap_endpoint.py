#!/usr/bin/env python3
"""
Test Correct SOAP Search API Endpoint
This script tests the actual SOAP Search API endpoint to capture
the real access denied error for Tourplan support.
"""

import requests
import json
from datetime import datetime

# Correct SOAP Search API endpoint
SOAP_SEARCH_URL = "https://pa-thisis.nx.tourplan.net/soap/search"
HOSTCONNECT_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
USERNAME = "SAMAGT"
PASSWORD = "S@MAgt01"
AGENT_ID = "SAMAGT"

def create_soap_search_request():
    """Create SOAP request for the correct search endpoint"""
    return f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <Authentication>
      <Username>{USERNAME}</Username>
      <Password>{PASSWORD}</Password>
      <AgentId>{AGENT_ID}</AgentId>
    </Authentication>
  </soap:Header>
  <soap:Body>
    <SearchTours>
      <Country>South Africa</Country>
      <Destination>Cape Town</Destination>
      <IncludeCancellationDeadlines>true</IncludeCancellationDeadlines>
    </SearchTours>
  </soap:Body>
</soap:Envelope>"""

def test_soap_search_endpoint():
    """Test the correct SOAP Search API endpoint"""
    print("="*80)
    print("TESTING CORRECT SOAP SEARCH API ENDPOINT")
    print("="*80)
    print(f"Testing at: {datetime.now()}")
    print(f"SOAP Search URL: {SOAP_SEARCH_URL}")
    print(f"HostConnect URL: {HOSTCONNECT_URL}")
    print(f"Agent ID: {AGENT_ID}")
    print(f"IP Address: 84.46.231.251")
    print("="*80)
    
    soap_request = create_soap_search_request()
    
    print("\n📤 SOAP REQUEST:")
    print(soap_request)
    
    headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': ''
    }
    
    print(f"\n📋 REQUEST HEADERS:")
    for key, value in headers.items():
        print(f"  {key}: {value}")
    
    try:
        print(f"\n🔄 Sending request to SOAP Search endpoint...")
        start_time = time.time()
        
        response = requests.post(
            SOAP_SEARCH_URL,
            data=soap_request,
            headers=headers,
            timeout=30
        )
        
        response_time = int((time.time() - start_time) * 1000)
        
        print(f"\n📥 RESPONSE FROM SOAP SEARCH ENDPOINT:")
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {response_time}ms")
        print("Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        print(f"\nResponse Body:")
        print(response.text)
        
        # Analyze the response
        if response.status_code == 403:
            print("\n🚫 ACCESS DENIED (403) - This is the IP whitelisting issue!")
            print("The SOAP Search API endpoint is not whitelisted for IP 84.46.231.251")
            access_denied = True
        elif response.status_code == 401:
            print("\n🔐 AUTHENTICATION FAILED (401)")
            access_denied = False
        elif response.status_code == 404:
            print("\n❓ ENDPOINT NOT FOUND (404) - SOAP Search endpoint may not exist")
            access_denied = False
        elif response.status_code == 200:
            if "soap:Fault" in response.text:
                print("\n⚠️  SOAP FAULT in response")
                access_denied = False
            else:
                print("\n✅ SUCCESS - SOAP Search API is working!")
                access_denied = False
        else:
            print(f"\n❓ UNEXPECTED STATUS: {response.status_code}")
            access_denied = False
        
        # Save the error report
        error_report = {
            "timestamp": datetime.now().isoformat(),
            "test_purpose": "Test correct SOAP Search API endpoint for access denied error",
            "ip_address": "84.46.231.251",
            "agent_credentials": AGENT_ID,
            "soap_search_endpoint": SOAP_SEARCH_URL,
            "hostconnect_endpoint": HOSTCONNECT_URL,
            "request": {
                "method": "POST",
                "headers": headers,
                "body": soap_request
            },
            "response": {
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "body": response.text,
                "response_time_ms": response_time
            },
            "analysis": {
                "access_denied": access_denied,
                "issue_confirmed": access_denied,
                "next_steps": "Request SOAP Search API whitelisting" if access_denied else "Investigate other issues"
            }
        }
        
        filename = f"soap_search_endpoint_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(error_report, f, indent=2)
        
        print(f"\n📄 Test report saved to: {filename}")
        
        return error_report
        
    except requests.exceptions.RequestException as e:
        print(f"\n💥 REQUEST FAILED: {str(e)}")
        
        # This could indicate network issues or endpoint doesn't exist
        error_report = {
            "timestamp": datetime.now().isoformat(),
            "test_purpose": "Test correct SOAP Search API endpoint for access denied error",
            "ip_address": "84.46.231.251",
            "agent_credentials": AGENT_ID,
            "soap_search_endpoint": SOAP_SEARCH_URL,
            "request": {
                "method": "POST",
                "headers": headers,
                "body": soap_request
            },
            "error": str(e),
            "analysis": {
                "access_denied": False,
                "endpoint_exists": False,
                "next_steps": "Confirm correct SOAP Search API endpoint URL"
            }
        }
        
        filename = f"soap_search_endpoint_error_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(error_report, f, indent=2)
        
        print(f"\n📄 Error report saved to: {filename}")
        return error_report

def compare_endpoints():
    """Compare responses from both endpoints"""
    print("\n" + "="*80)
    print("ENDPOINT COMPARISON SUMMARY")
    print("="*80)
    
    print("✅ HostConnect XML API (Working):")
    print(f"   URL: {HOSTCONNECT_URL}")
    print("   Format: HostConnect XML (AgentInfoRequest, OptionInfoRequest)")
    print("   Status: IP 84.46.231.251 is whitelisted and working")
    
    print("\n❓ SOAP Search API (Testing):")
    print(f"   URL: {SOAP_SEARCH_URL}")
    print("   Format: SOAP envelope with SearchTours")
    print("   Status: Testing for IP whitelisting...")

if __name__ == "__main__":
    import time
    
    print("🔍 SOAP Search API Endpoint Tester")
    print("This will test the correct SOAP Search API endpoint to determine")
    print("if there's an IP whitelisting issue or other problem.")
    print()
    
    compare_endpoints()
    print()
    
    input("Press Enter to test the SOAP Search API endpoint...")
    
    result = test_soap_search_endpoint()
    
    print("\n" + "="*80)
    print("CONCLUSION FOR TOURPLAN SUPPORT")
    print("="*80)
    
    if result.get('analysis', {}).get('access_denied'):
        print("🚫 CONFIRMED: IP whitelisting issue with SOAP Search API")
        print("   - HostConnect XML API works (IP is whitelisted)")
        print("   - SOAP Search API returns 403 Access Denied")
        print("   - Need to whitelist IP 84.46.231.251 for SOAP Search API")
    elif result.get('analysis', {}).get('endpoint_exists') == False:
        print("❓ SOAP Search API endpoint may not exist or URL is incorrect")
        print("   - Need to confirm correct SOAP Search API endpoint URL")
    else:
        print("✅ SOAP Search API is accessible")
        print("   - No IP whitelisting issue found")
        print("   - May need to investigate request format or other issues")
