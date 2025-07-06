import requests
import time
from datetime import datetime

def test_ip_consistency_detailed():
    """Test IP consistency and Tourplan response over multiple attempts"""
    
    AGENT_ID = "SAMAGT"
    PASSWORD = "S@MAgt01"  # You revealed this in your message
    API_BASE_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
    
    print("=== Testing IP Consistency & Tourplan Responses ===")
    
    for attempt in range(5):
        print(f"\n--- Attempt {attempt + 1} at {datetime.now().strftime('%H:%M:%S')} ---")
        
        # Check current IP
        try:
            ip_response = requests.get('https://httpbin.org/ip', timeout=5)
            current_ip = ip_response.json()['origin']
            print(f"Current IP: {current_ip}")
        except Exception as e:
            print(f"IP check failed: {e}")
            continue
        
        # Test Ping (should work)
        ping_xml = """<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request><PingRequest/></Request>"""
        
        try:
            ping_response = requests.post(API_BASE_URL, data=ping_xml, 
                                        headers={'Content-Type': 'text/xml'}, timeout=10)
            ping_status = "✅ Working" if ping_response.status_code == 200 and "PingReply" in ping_response.text else "❌ Failed"
            print(f"Ping test: {ping_status}")
        except Exception as e:
            print(f"Ping test: ❌ Error - {e}")
        
        # Test Authentication
        auth_xml = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <AgentInfoRequest>
        <AgentID>{AGENT_ID}</AgentID>
        <Password>{PASSWORD}</Password>
        <ReturnAccountInfo>N</ReturnAccountInfo>
    </AgentInfoRequest>
</Request>"""
        
        try:
            auth_response = requests.post(API_BASE_URL, data=auth_xml, 
                                        headers={'Content-Type': 'text/xml'}, timeout=10)
            
            if "AgentInfoReply" in auth_response.text:
                auth_status = "✅ Success"
            elif "2050" in auth_response.text:
                auth_status = "❌ IP Not Whitelisted (Error 2050)"
            elif "ErrorReply" in auth_response.text:
                auth_status = "❌ Other Error"
            else:
                auth_status = f"❌ Unknown ({auth_response.status_code})"
                
            print(f"Auth test: {auth_status}")
            
        except Exception as e:
            print(f"Auth test: ❌ Error - {e}")
        
        if attempt < 4:  # Don't wait after the last attempt
            time.sleep(10)  # Wait 10 seconds between attempts

test_ip_consistency_detailed()
