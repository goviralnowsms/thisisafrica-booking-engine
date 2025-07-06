#!/usr/bin/env python3
"""
SOAP Search API Test Script
This script tests the specific SOAP Search API that is failing with access denied errors.
It will capture the exact request and error response needed for Tourplan support.
"""

import requests
import json
import time
from datetime import datetime

# SOAP Search API Configuration
SOAP_API_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
USERNAME = "SAMAGT"  # Your agent credentials
PASSWORD = "S@MAgt01"
AGENT_ID = "SAMAGT"

def build_soap_search_xml(params=None):
    """Build SOAP XML request for SearchTours"""
    if params is None:
        params = {}
    
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
      {f'<Country>{params.get("country")}</Country>' if params.get("country") else ""}
      {f'<Destination>{params.get("destination")}</Destination>' if params.get("destination") else ""}
      {f'<TourLevel>{params.get("tourLevel")}</TourLevel>' if params.get("tourLevel") else ""}
      {f'<StartDate>{params.get("startDate")}</StartDate>' if params.get("startDate") else ""}
      {f'<EndDate>{params.get("endDate")}</EndDate>' if params.get("endDate") else ""}
      <IncludeCancellationDeadlines>true</IncludeCancellationDeadlines>
    </SearchTours>
  </soap:Body>
</soap:Envelope>"""

def test_soap_search_api():
    """Test SOAP Search API and capture exact error details"""
    print("="*80)
    print("SOAP SEARCH API TEST - CAPTURING ERROR FOR TOURPLAN SUPPORT")
    print("="*80)
    print(f"Testing at: {datetime.now()}")
    print(f"API URL: {SOAP_API_URL}")
    print(f"Agent ID: {AGENT_ID}")
    print(f"IP Address: 84.46.231.251 (should be whitelisted)")
    print("="*80)
    
    # Test scenarios
    test_scenarios = [
        {
            "name": "Basic Search (No Parameters)",
            "params": {}
        },
        {
            "name": "Search by Country",
            "params": {"country": "South Africa"}
        },
        {
            "name": "Search by Destination",
            "params": {"destination": "Cape Town"}
        },
        {
            "name": "Search with Date Range",
            "params": {
                "country": "South Africa",
                "startDate": "2024-07-01",
                "endDate": "2024-07-31"
            }
        }
    ]
    
    results = []
    
    for scenario in test_scenarios:
        print(f"\n🧪 Testing: {scenario['name']}")
        print("-" * 50)
        
        # Build SOAP request
        soap_request = build_soap_search_xml(scenario['params'])
        
        print("📤 SOAP REQUEST:")
        print(soap_request)
        print()
        
        # Prepare headers
        headers = {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': '',
            'User-Agent': 'TourplanBookingEngine/1.0'
        }
        
        try:
            print("⏱️  Sending request...")
            start_time = time.time()
            
            response = requests.post(
                SOAP_API_URL,
                data=soap_request,
                headers=headers,
                timeout=30
            )
            
            response_time = int((time.time() - start_time) * 1000)
            
            print(f"📥 RESPONSE RECEIVED ({response_time}ms):")
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            print(f"Response Body:")
            print(response.text)
            print()
            
            # Store result
            result = {
                "scenario": scenario['name'],
                "request": soap_request,
                "response_code": response.status_code,
                "response_headers": dict(response.headers),
                "response_body": response.text,
                "response_time_ms": response_time,
                "timestamp": datetime.now().isoformat(),
                "success": response.status_code == 200 and "soap:Fault" not in response.text
            }
            
            results.append(result)
            
            # Analyze response
            if response.status_code == 200:
                if "soap:Fault" in response.text:
                    print("❌ SOAP FAULT DETECTED")
                elif "SearchToursResponse" in response.text:
                    print("✅ SUCCESS - SearchTours response received")
                else:
                    print("⚠️  UNEXPECTED RESPONSE FORMAT")
            else:
                print(f"❌ HTTP ERROR: {response.status_code}")
                if response.status_code == 403:
                    print("🚫 ACCESS DENIED - This is the error Tourplan needs to see!")
                elif response.status_code == 401:
                    print("🔐 AUTHENTICATION FAILED")
                elif response.status_code == 404:
                    print("🔍 ENDPOINT NOT FOUND")
            
        except requests.exceptions.RequestException as e:
            print(f"💥 REQUEST FAILED: {str(e)}")
            result = {
                "scenario": scenario['name'],
                "request": soap_request,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "success": False
            }
            results.append(result)
        
        print("-" * 50)
    
    # Generate summary report
    print("\n" + "="*80)
    print("SUMMARY REPORT FOR TOURPLAN SUPPORT")
    print("="*80)
    
    successful_tests = sum(1 for r in results if r.get('success', False))
    total_tests = len(results)
    
    print(f"Tests Run: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {total_tests - successful_tests}")
    
    # Find the specific error for Tourplan
    access_denied_errors = [r for r in results if r.get('response_code') == 403]
    auth_errors = [r for r in results if r.get('response_code') == 401]
    soap_faults = [r for r in results if 'soap:Fault' in r.get('response_body', '')]
    
    if access_denied_errors:
        print(f"\n🚫 ACCESS DENIED ERRORS FOUND: {len(access_denied_errors)}")
        print("This is the error Tourplan needs to investigate!")
        
        for error in access_denied_errors:
            print(f"\nScenario: {error['scenario']}")
            print("REQUEST THAT CAUSED ACCESS DENIED:")
            print(error['request'])
            print(f"\nRESPONSE CODE: {error['response_code']}")
            print("RESPONSE BODY:")
            print(error['response_body'])
    
    if auth_errors:
        print(f"\n🔐 AUTHENTICATION ERRORS: {len(auth_errors)}")
    
    if soap_faults:
        print(f"\n⚠️  SOAP FAULTS: {len(soap_faults)}")
    
    # Save detailed report
    report_filename = f"soap_search_api_error_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_filename, 'w') as f:
        json.dump({
            "summary": {
                "test_purpose": "Capture SOAP Search API access denied error for Tourplan support",
                "ip_address": "84.46.231.251",
                "agent_id": AGENT_ID,
                "api_url": SOAP_API_URL,
                "timestamp": datetime.now().isoformat(),
                "total_tests": total_tests,
                "successful_tests": successful_tests,
                "failed_tests": total_tests - successful_tests
            },
            "test_results": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: {report_filename}")
    print("\n" + "="*80)
    print("INFORMATION FOR TOURPLAN SUPPORT:")
    print("="*80)
    print("Subject: SOAP Search API Access Denied - IP Whitelisting Request")
    print(f"IP Address: 84.46.231.251")
    print(f"Agent ID: {AGENT_ID}")
    print(f"API Endpoint: {SOAP_API_URL}")
    print("Issue: HostConnect XML API works, but SOAP Search API returns access denied")
    print(f"Error Report File: {report_filename}")
    
    if access_denied_errors:
        print("\nSample failing request:")
        print(access_denied_errors[0]['request'])
        print(f"\nError response code: {access_denied_errors[0]['response_code']}")
        print("Error response body:")
        print(access_denied_errors[0]['response_body'])

if __name__ == "__main__":
    print("🔍 SOAP Search API Error Capture Tool")
    print("This will test the SOAP Search API and capture the exact error details")
    print("that Tourplan support needs to investigate the whitelisting issue.")
    print()
    
    input("Press Enter to start the test (make sure you're connected to VPN)...")
    test_soap_search_api()
