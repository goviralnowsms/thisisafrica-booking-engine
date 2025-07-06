#!/usr/bin/env python3
"""
VPN IP Address Verification Script
This script checks your current IP address and verifies if you're using your VPN.
"""

import requests

def check_vpn_ip():
    """Check current IP and verify if VPN is active."""
    
    print("=" * 50)
    print("VPN IP Address Verification")
    print("=" * 50)
    
    try:
        # Check your current IP
        print("Checking current IP address...")
        ip_check = requests.get('https://httpbin.org/ip', timeout=10)
        current_ip = ip_check.json()['origin']
        print(f"Current IP: {current_ip}")
        
        # Verify it matches your VPN IP
        expected_ip = "84.46.231.251"
        if current_ip == expected_ip:
            print("✅ Correct IP - you're using your VPN!")
        else:
            print(f"❌ Wrong IP - Expected {expected_ip}, got {current_ip}")
            print("Make sure your VPN is connected")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error checking IP address: {e}")
        print("Please check your internet connection")
    except KeyError as e:
        print(f"❌ Error parsing response: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    
    print("=" * 50)

if __name__ == "__main__":
    check_vpn_ip()
