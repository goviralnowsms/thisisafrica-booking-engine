#!/usr/bin/env python3
"""
HostConnect XML Search Test
This script tests search functionality using the correct HostConnect XML format
instead of SOAP, based on the working OptionInfoRequest pattern.
"""

import requests
import json
from datetime import datetime
from xml.dom import minidom

# Configuration
API_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
AGENT_ID = "SAMAGT"
PASSWORD = "S@MAgt01"

def build_hostconnect_search_xml(params=None):
    """Build HostConnect XML search request (trying different possible formats)"""
    if params is None:
        params = {}
    
    # Try format similar to OptionInfoRequest
    return f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <SearchRequest>
        <AgentID>{AGENT_ID}</AgentID>
        <Password>{PASSWORD}</Password>
        {f'<Country>{params.get("country")}</Country>' if params.get("country") else ""}
        {f'<Destination>{params.get("destination")}</Destination>' if params.get("destination") else ""}
        {f'<TourLevel>{params.get("tourLevel")}</TourLevel>' if params.get("tourLevel") else ""}
        {f'<StartDate>{params.get("startDate")}</StartDate>' if params.get("startDate") else ""}
        {f'<EndDate>{params.get("endDate")}</EndDate>' if params.get("endDate") else ""}
    </SearchRequest>
</Request>"""

def build_alternative_search_xml(params=None):
    """Try alternative HostConnect XML search format"""
    if params is None:
        params = {}
    
    return f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <TourSearchRequest>
        <AgentID>{AGENT_ID}</AgentID>
        <Password>{PASSWORD}</Password>
        {f'<Country>{params.get("country")}</Country>' if params.get("country") else ""}
        {f'<Destination>{params.get("destination")}</Destination>' if params.get("destination") else ""}
        {f'<TourLevel>{params.get("tourLevel")}</TourLevel>' if params.get("tourLevel") else ""}
        {f'<DateFrom>{params.get("startDate")}</DateFrom>' if params.get("startDate") else ""}
        {f'<DateTo>{params.get("endDate")}</DateTo>' if params.get("endDate") else ""}
    </TourSearchRequest>
</Request>"""

def build_option_search_xml(params=None):
    """Try using OptionInfoRequest with search parameters"""
    if params is None:
        params = {}
    
    return f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <OptionInfoRequest>
        <AgentID>{AGENT_ID}</AgentID>
        <Password>{PASSWORD}</Password>
        <ButtonName>SEARCH</ButtonName>
        <DestinationName>{params.get("destination", "Cape Town")}</DestinationName>
        <Info>SEARCH</Info>
    </OptionInfoRequest>
</Request>"""

def pretty_print_xml(xml_string):
    """Pretty print XML for better readability"""
    try:
        dom = minidom.parseString(xml_string)
        return dom.toprettyxml(indent="  ")
    except:
        return xml_string

def test_hostconnect_search():
    """Test HostConnect XML search formats"""
    print("="*80)
    print("HOSTCONNECT XML SEARCH FORMAT TESTING")
    print("="*80)
    print(f"Testing at: {datetime.now()}")
    print(f"API URL: {API_URL}")
    print(f"Agent ID: {AGENT_ID}")
    print("="*80)
    
    # Test parameters
    search_params = {
        "country": "South Africa",
        "destination": "Cape Town",
        "startDate": "2024-07-01",
        "endDate": "2024-07-31"
    }
    
    # Different XML formats to try
    test_formats = [
        ("SearchRequest Format", build_hostconnect_search_xml),
        ("TourSearchRequest Format", build_alternative_search_xml),
        ("OptionInfoRequest with Search", build_option_search_xml)
    ]
    
    results = []
    
    for format_name, xml_builder in test_formats:
        print(f"\n🧪 Testing: {format_name}")
        print("-" * 60)
        
        # Build XML request
        xml_request = xml_builder(search_params)
        
        print("📤 XML REQUEST:")
        print(pretty_print_xml(xml_request))
        
        # Headers for HostConnect XML
        headers = {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        }
        
        try:
            print("⏱️  Sending request...")
            start_time = time.time()
            
            response = requests.post(
                API_URL,
                data=xml_request,
                headers=headers,
                timeout=30
            )
            
            response_time = int((time.time() - start_time) * 1000)
            
            print(f"📥 RESPONSE RECEIVED ({response_time}ms):")
            print(f"Status Code: {response.status_code}")
            print("Response Body:")
            print(pretty_print_xml(response.text))
            
            # Analyze response
            success = False
            analysis = ""
            
            if response.status_code == 200:
                if "<ErrorReply>" in response.text:
                    if "was not expected" in response.text:
                        analysis = "❌ XML Format not recognized"
                    elif "Invalid" in response.text:
                        analysis = "❌ Invalid request format"
                    else:
                        analysis = "❌ Other error in response"
                elif "<SearchReply>" in response.text or "<TourSearchReply>" in response.text:
                    analysis = "✅ SUCCESS - Search response received!"
                    success = True
                elif "<OptionInfoReply>" in response.text:
                    analysis = "✅ OptionInfo response (may contain search data)"
                    success = True
                else:
                    analysis = "⚠️  Unexpected response format"
            else:
                analysis = f"❌ HTTP Error: {response.status_code}"
            
            print(f"Analysis: {analysis}")
            
            # Store result
            result = {
                "format": format_name,
                "request": xml_request,
                "response_code": response.status_code,
                "response_body": response.text,
                "response_time_ms": response_time,
                "success": success,
                "analysis": analysis,
                "timestamp": datetime.now().isoformat()
            }
            results.append(result)
            
        except requests.exceptions.RequestException as e:
            print(f"💥 REQUEST FAILED: {str(e)}")
            result = {
                "format": format_name,
                "request": xml_request,
                "error": str(e),
                "success": False,
                "timestamp": datetime.now().isoformat()
            }
            results.append(result)
        
        print("-" * 60)
    
    # Generate summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    
    successful_formats = [r for r in results if r.get('success', False)]
    
    if successful_formats:
        print("✅ WORKING FORMATS FOUND:")
        for result in successful_formats:
            print(f"  - {result['format']}: {result.get('analysis', 'Success')}")
    else:
        print("❌ NO WORKING SEARCH FORMATS FOUND")
        print("\nThis confirms that search functionality may not be available")
        print("through the current HostConnect XML API endpoint, or requires")
        print("a different request format not tested here.")
    
    # Save detailed report
    report_filename = f"hostconnect_search_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_filename, 'w') as f:
        json.dump({
            "summary": {
                "test_purpose": "Test HostConnect XML search formats",
                "api_url": API_URL,
                "agent_id": AGENT_ID,
                "timestamp": datetime.now().isoformat(),
                "total_formats_tested": len(results),
                "successful_formats": len(successful_formats)
            },
            "test_results": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: {report_filename}")
    
    return results

if __name__ == "__main__":
    import time
    
    print("🔍 HostConnect XML Search Format Tester")
    print("This will test different HostConnect XML formats for search functionality")
    print("to find the correct format that Tourplan expects.")
    print()
    
    input("Press Enter to start testing (make sure you're connected to VPN)...")
    test_hostconnect_search()
