import requests
from xml.dom import minidom

API_BASE_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
AGENT_ID = "SAMAGT"  # Replace with your actual Agent ID
PASSWORD = "S@MAgt01"  # Actual password from .env.local

def test_agent_authentication():
    """Test full agent authentication"""
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
        'Content-Type': 'text/xml',
        'Accept': 'text/xml'
    }
    
    try:
        response = requests.post(API_BASE_URL, data=xml_request, headers=headers)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        
        # Pretty print the XML response
        dom = minidom.parseString(response.text)
        print(dom.toprettyxml(indent="  "))
        
        if "AgentInfoReply" in response.text:
            print("\n✅ AUTHENTICATION SUCCESSFUL!")
            print("🎉 You can now proceed with building your booking engine!")
        elif "ErrorReply" in response.text:
            print("\n❌ Authentication failed - check your credentials")
        
    except Exception as e:
        print(f"Error: {e}")

# Run the authentication test
if __name__ == "__main__":
    test_agent_authentication()
