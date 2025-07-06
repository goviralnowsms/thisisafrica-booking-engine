#!/usr/bin/env python3
"""
Test script to verify real Tourplan API integration for search
"""

import requests
import json
import time
from datetime import datetime

def test_real_tourplan_search():
    """Test the search API with real Tourplan data"""
    
    print("🧪 Testing Real Tourplan API Search Integration")
    print("=" * 60)
    
    # Test different search scenarios
    test_cases = [
        {
            "name": "Cape Town Day Tours",
            "params": {
                "destination": "Cape Town",
                "startDate": "2025-07-01",
                "adults": 2,
                "children": 0
            }
        },
        {
            "name": "Johannesburg Tours",
            "params": {
                "destination": "Johannesburg", 
                "startDate": "2025-07-15",
                "adults": 2,
                "children": 0
            }
        },
        {
            "name": "Kruger Safari",
            "params": {
                "destination": "Kruger",
                "startDate": "2025-08-01",
                "adults": 4,
                "children": 0,
                "tourType": "safari"
            }
        },
        {
            "name": "Broad Search (No Destination)",
            "params": {
                "startDate": "2025-07-01",
                "adults": 2,
                "children": 0
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\n🔍 Testing: {test_case['name']}")
        print(f"Parameters: {json.dumps(test_case['params'], indent=2)}")
        
        try:
            start_time = time.time()
            
            response = requests.post(
                "http://localhost:3000/api/tours/search",
                json=test_case['params'],
                headers={"Content-Type": "application/json"},
                timeout=60  # Increased timeout for API calls
            )
            
            response_time = int((time.time() - start_time) * 1000)
            
            print(f"Response Status: {response.status_code}")
            print(f"Response Time: {response_time}ms")
            
            if response.status_code == 200:
                data = response.json()
                
                total_found = data.get('totalFound', 0)
                source = data.get('source', 'unknown')
                cached = data.get('cached', False)
                tours = data.get('tours', [])
                
                print(f"✅ Success! Found {total_found} tours")
                print(f"Source: {source}")
                print(f"Cached: {cached}")
                
                # Check if we got real Tourplan data
                is_real_data = source == "tourplan-api" and not cached and total_found > 0
                
                if is_real_data:
                    print("🎉 REAL TOURPLAN DATA RETRIEVED!")
                    
                    # Show sample tours
                    print(f"\nSample tours (showing first {min(3, len(tours))}):")
                    for i, tour in enumerate(tours[:3]):
                        print(f"  {i+1}. {tour.get('name', 'Unknown')}")
                        print(f"     Price: {tour.get('price', 0)} {tour.get('currency', 'USD')}")
                        print(f"     Location: {tour.get('location', 'Unknown')}")
                        print(f"     Supplier: {tour.get('supplier', 'Unknown')}")
                        print(f"     Availability: {tour.get('availability', 'Unknown')}")
                        print()
                        
                elif source == "tourplan-api" and total_found == 0:
                    print("⚠️  Tourplan API responded but no tours found for this search")
                    
                else:
                    print("ℹ️  Using mock/cached data")
                
                results.append({
                    'test': test_case['name'],
                    'success': True,
                    'real_data': is_real_data,
                    'total_found': total_found,
                    'source': source,
                    'response_time': response_time
                })
                
            else:
                print(f"❌ Error: HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error details: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error text: {response.text}")
                
                results.append({
                    'test': test_case['name'],
                    'success': False,
                    'error': f"HTTP {response.status_code}",
                    'response_time': response_time
                })
                
        except requests.exceptions.ConnectionError:
            print("❌ Error: Could not connect to localhost:3000")
            print("Make sure the Next.js development server is running")
            results.append({
                'test': test_case['name'],
                'success': False,
                'error': "Connection failed"
            })
            
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append({
                'test': test_case['name'],
                'success': False,
                'error': str(e)
            })
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(results)
    successful_tests = sum(1 for r in results if r['success'])
    real_data_tests = sum(1 for r in results if r.get('real_data', False))
    
    print(f"Total Tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Real Tourplan Data: {real_data_tests}")
    print(f"Success Rate: {(successful_tests/total_tests)*100:.1f}%")
    print(f"Real Data Rate: {(real_data_tests/total_tests)*100:.1f}%")
    
    if real_data_tests > 0:
        print("\n🎉 SUCCESS: Real Tourplan API data is being retrieved!")
        print("The search API is now using live Tourplan sandbox data.")
    elif successful_tests > 0:
        print("\n⚠️  API is working but using mock/cached data.")
        print("Check Tourplan API connectivity and credentials.")
    else:
        print("\n❌ API tests failed. Check server and configuration.")
    
    # Save detailed results
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    report_file = f"tourplan_search_test_{timestamp}.json"
    
    with open(report_file, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_tests': total_tests,
                'successful': successful_tests,
                'real_data': real_data_tests,
                'success_rate': (successful_tests/total_tests)*100,
                'real_data_rate': (real_data_tests/total_tests)*100
            },
            'results': results
        }, f, indent=2)
    
    print(f"\nDetailed results saved to: {report_file}")

if __name__ == "__main__":
    print("Make sure:")
    print("1. Next.js dev server is running (npm run dev)")
    print("2. VPN is connected to South Africa")
    print("3. Tourplan credentials are configured")
    print()
    
    input("Press Enter to start testing...")
    test_real_tourplan_search()
