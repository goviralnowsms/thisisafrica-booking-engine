import requests

def verify_exit_ip():
    """Verify the IP that external services actually see"""
    print("=== IP Verification (What External Services See) ===")
    
    services = [
        ('httpbin.org', 'https://httpbin.org/ip'),
        ('ipify.org', 'https://api.ipify.org?format=json'),
        ('whatismyipaddress.com', 'https://ipv4bot.whatismyipaddress.com/'),
        ('ipinfo.io', 'https://ipinfo.io/json')
    ]
    
    expected_ip = "84.46.231.251"
    all_match = True
    
    for service_name, url in services:
        try:
            response = requests.get(url, timeout=10)
            
            if 'ipify' in url:
                ip = response.json()['ip']
            elif 'httpbin' in url:
                ip = response.json()['origin']
            elif 'whatismyipaddress' in url:
                ip = response.text.strip()
            elif 'ipinfo' in url:
                data = response.json()
                ip = data['ip']
                print(f"{service_name}: {ip} (Location: {data.get('city', 'Unknown')}, ISP: {data.get('org', 'Unknown')})")
                continue
            else:
                ip = response.text.strip()
                
            status = "✅" if ip == expected_ip else "❌"
            print(f"{service_name}: {ip} {status}")
            
            if ip != expected_ip:
                all_match = False
                
        except Exception as e:
            print(f"{service_name}: Error - {e}")
    
    print(f"\nExpected IP: {expected_ip}")
    print(f"All services match: {'✅ Yes' if all_match else '❌ No'}")
    
    return all_match

verify_exit_ip()
