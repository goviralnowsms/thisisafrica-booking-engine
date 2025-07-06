#!/usr/bin/env python3
"""
Direct SOAP Search API Error Capture
This script replicates the exact SOAP request from the TypeScript code
to capture the specific access denied error for Tourplan support.
"""

import requests
import json
from datetime import datetime

# Configuration matching your TypeScript implementation
SOAP_API_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
USERNAME = "SAMAGT"
PASSWORD = "S@MAgt01"
AGENT_ID = "SAMAGT"

def create_exact_soap_request():
    """Create the exact SOAP request that your TypeScript code generates"""
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

def test_soap_search_error():
    """Test and capture the exact SOAP Search API error"""
    print("SOAP SEARCH API ERROR CAPTURE FOR TOURPLAN SUPPORT")
    print("=" * 60)
    print(f"Timestamp: {datetime.now()}")
    print(f"IP Address: 84.46.231.251")
    print(f"Agent ID: {AGENT_ID}")
    print(f"API URL: {SOAP_API_URL}")
    print("=" * 60)
    
    # Create the exact SOAP request
    soap_request = create_exact_soap_request()
    
    print("\nSOAP REQUEST BEING SENT:")
    print("-" * 40)
    print(soap_request)
    print("-" * 40)
    
    # Headers matching your TypeScript implementation
    headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': ''
    }
    
    print(f"\nREQUEST HEADERS:")
    for key, value in headers.items():
        print(f"{key}: {value}")
    
    try:
        print(f"\nSending request to: {SOAP_API_URL}")
        response = requests.post(
            SOAP_API_URL,
            data=soap_request,
            headers=headers,
            timeout=30
        )
        
        print(f"\nRESPONSE RECEIVED:")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
        
        print(f"\nResponse Body:")
        print(response.text)
        
        # Save the error details for Tourplan
        error_report = {
            "timestamp": datetime.now().isoformat(),
            "ip_address": "84.46.231.251",
            "agent_credentials": AGENT_ID,
            "api_endpoint": SOAP_API_URL,
            "request": {
                "method": "POST",
                "headers": headers,
                "body": soap_request
            },
            "response": {
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "body": response.text
            },
            "issue_description": "SOAP Search API access denied - HostConnect XML API works but SOAP Search API fails"
        }
        
        # Save to file
        filename = f"soap_search_error_for_tourplan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(error_report, f, indent=2)
        
        print(f"\nError report saved to: {filename}")
        
        # Analysis
        print(f"\nERROR ANALYSIS:")
        if response.status_code == 403:
            print("❌ ACCESS DENIED (403) - This is the error Tourplan needs to investigate!")
            print("The IP address 84.46.231.251 is not whitelisted for SOAP Search API")
        elif response.status_code == 401:
            print("❌ AUTHENTICATION FAILED (401)")
        elif response.status_code == 404:
            print("❌ ENDPOINT NOT FOUND (404)")
        elif response.status_code == 500:
            print("❌ SERVER ERROR (500)")
        elif response.status_code == 200:
            if "soap:Fault" in response.text:
                print("❌ SOAP FAULT in response")
            else:
                print("✅ SUCCESS - Request worked!")
        else:
            print(f"❌ UNEXPECTED STATUS CODE: {response.status_code}")
        
        return error_report
        
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST FAILED: {str(e)}")
        error_report = {
            "timestamp": datetime.now().isoformat(),
            "ip_address": "84.46.231.251",
            "agent_credentials": AGENT_ID,
            "api_endpoint": SOAP_API_URL,
            "request": {
                "method": "POST",
                "headers": headers,
                "body": soap_request
            },
            "error": str(e),
            "issue_description": "SOAP Search API request failed with network error"
        }
        return error_report

if __name__ == "__main__":
    print("This script will capture the exact SOAP Search API error")
    print("that you need to provide to Tourplan support.")
    print()
    
    error_report = test_soap_search_error()
    
    print("\n" + "=" * 60)
    print("SUMMARY FOR TOURPLAN SUPPORT EMAIL:")
    print("=" * 60)
    print("Subject: SOAP Search API Access Denied - IP Whitelisting Issue")
    print()
    print("Dear Tourplan Support,")
    print()
    print("I am experiencing access issues with the SOAP Search API despite")
    print("having my IP address (84.46.231.251) successfully whitelisted")
    print("for the HostConnect XML API.")
    print()
    print("WORKING: HostConnect XML API (AgentInfoRequest, OptionInfoRequest)")
    print("FAILING: SOAP Search API (SearchTours)")
    print()
    print("Request Details:")
    print(f"- IP Address: 84.46.231.251")
    print(f"- Agent ID: {AGENT_ID}")
    print(f"- API Endpoint: {SOAP_API_URL}")
    print(f"- Error Status: {error_report.get('response', {}).get('status_code', 'Network Error')}")
    print()
    print("The exact request and error response are attached in the JSON file.")
    print("Please update the whitelisting to include SOAP Search API access.")
    print()
    print("Thank you,")
    print("Your Name")
