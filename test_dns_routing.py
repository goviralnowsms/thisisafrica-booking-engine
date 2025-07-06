import socket
import requests

def test_dns_and_routing():
    """Test DNS resolution and routing"""
    print("\n=== DNS and Routing Test ===")
    
    # Test DNS resolution
    try:
        tourplan_ip = socket.gethostbyname('pa-thisis.nx.tourplan.net')
        print(f"Tourplan server resolves to: {tourplan_ip}")
    except Exception as e:
        print(f"DNS resolution failed: {e}")
    
    # Test if we can reach the server
    try:
        response = requests.get('https://pa-thisis.nx.tourplan.net', timeout=10)
        print(f"Can reach Tourplan server: ✅ (Status: {response.status_code})")
    except Exception as e:
        print(f"Cannot reach Tourplan server: ❌ ({e})")

test_dns_and_routing()
