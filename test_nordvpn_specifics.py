# test_nordvpn_specifics.py
import requests
import time
from datetime import datetime
import subprocess
import sys

def test_connection_stability():
    """Test if IP changes during session"""
    print("=== Testing IP Stability Over Time ===")
    
    for i in range(3):  # Reduced to 3 tests for quicker results
        try:
            response = requests.get('https://httpbin.org/ip', timeout=10)
            ip = response.json()['origin']
            print(f"Test {i+1}: {ip} at {time.strftime('%H:%M:%S')}")
            if i < 2:  # Don't wait after the last test
                time.sleep(5)  # Wait 5 seconds between tests
        except Exception as e:
            print(f"Test {i+1}: Error - {e}")

def test_tourplan_with_detailed_logging():
    """Test Tourplan connection with detailed logging"""
    print(f"\n=== Tourplan Connection Test - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===")
    
    # Verify IP one more time
    try:
        ip_response = requests.get('https://httpbin.org/ip', timeout=10)
        current_ip = ip_response.json()['origin']
        print(f"Current exit IP: {current_ip}")
    except Exception as e:
        print(f"Could not verify IP: {e}")
        return
    
    # Test simple Ping request
    ping_xml = """<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <PingRequest/>
</Request>"""
    
    headers = {
        'Content-Type': 'text/xml',
        'Accept': 'text/xml',
        'User-Agent': 'Python-Tourplan-Test/1.0'
    }
    
    api_url = 'https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi'
    
    try:
        print(f"Attempting connection to: {api_url}")
        
        start_time = time.time()
        response = requests.post(
            api_url,
            data=ping_xml,
            headers=headers,
            timeout=30
        )
        end_time = time.time()
        
        print(f"Response time: {end_time - start_time:.2f} seconds")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✓ Connection successful!")
            print(f"Response content: {response.text[:500]}...")
        else:
            print(f"✗ Connection failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("✗ Connection timed out after 30 seconds")
    except requests.exceptions.ConnectionError as e:
        print(f"✗ Connection error: {e}")
    except Exception as e:
        print(f"✗ Unexpected error: {e}")

def test_dns_resolution():
    """Test DNS resolution for Tourplan domain"""
    print(f"\n=== DNS Resolution Test ===")
    
    domain = "pa-thisis.nx.tourplan.net"
    
    try:
        import socket
        ip = socket.gethostbyname(domain)
        print(f"✓ {domain} resolves to: {ip}")
    except Exception as e:
        print(f"✗ DNS resolution failed: {e}")

def main():
    """Run all tests"""
    print("Starting NordVPN and Tourplan connectivity tests...")
    print("=" * 60)
    
    # Test 1: IP stability
    test_connection_stability()
    
    # Test 2: DNS resolution
    test_dns_resolution()
    
    # Test 3: Tourplan API connection
    test_tourplan_with_detailed_logging()
    
    print("\n" + "=" * 60)
    print("Tests completed!")

if __name__ == "__main__":
    main()
