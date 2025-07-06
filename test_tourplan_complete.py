#!/usr/bin/env python3
"""
Complete Tourplan API Testing Suite
This script provides comprehensive testing for all Tourplan API functionality
including authentication, search, booking, and error handling.
"""

import requests
import json
import time
from xml.dom import minidom
import re
from datetime import datetime, timedelta

# API Configuration
API_BASE_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
LOCAL_API_URL = "http://localhost:3000"
AGENT_ID = "SAMAGT"
PASSWORD = "S@MAgt01"

class TourplanTester:
    def __init__(self):
        self.test_results = []
        self.start_time = datetime.now()
        
    def log_result(self, test_name, success, message, response_time=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response_time': response_time
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        time_info = f" ({response_time}ms)" if response_time else ""
        print(f"{status} {test_name}{time_info}: {message}")
    
    def pretty_print_xml(self, xml_string):
        """Pretty print XML for better readability"""
        try:
            dom = minidom.parseString(xml_string)
            return dom.toprettyxml(indent="  ")
        except:
            return xml_string
    
    def test_connectivity(self):
        """Test basic connectivity to Tourplan API"""
        print("\n" + "="*60)
        print("CONNECTIVITY TESTS")
        print("="*60)
        
        try:
            start_time = time.time()
            response = requests.get(API_BASE_URL, timeout=10)
            response_time = int((time.time() - start_time) * 1000)
            
            self.log_result(
                "Basic Connectivity", 
                True, 
                f"API endpoint reachable (Status: {response.status_code})",
                response_time
            )
        except requests.exceptions.RequestException as e:
            self.log_result("Basic Connectivity", False, f"Cannot reach API: {str(e)}")
    
    def test_authentication(self):
        """Test Tourplan authentication"""
        print("\n" + "="*60)
        print("AUTHENTICATION TESTS")
        print("="*60)
        
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
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        }

        try:
            start_time = time.time()
            response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)
            response_time = int((time.time() - start_time) * 1000)

            if "<ErrorReply>" in response.text:
                error_match = re.search(r'<Error>(.*?)</Error>', response.text)
                error_msg = error_match.group(1) if error_match else "Unknown error"
                self.log_result("Authentication", False, f"Auth failed: {error_msg}", response_time)
            elif "<AgentInfoReply>" in response.text:
                agent_name_match = re.search(r'<AgentName>(.*?)</AgentName>', response.text)
                agent_name = agent_name_match.group(1) if agent_name_match else "Unknown"
                self.log_result("Authentication", True, f"Auth successful - Agent: {agent_name}", response_time)
            else:
                self.log_result("Authentication", False, f"Unexpected response format", response_time)

        except requests.exceptions.RequestException as e:
            self.log_result("Authentication", False, f"Request failed: {str(e)}")
    
    def test_local_api_endpoints(self):
        """Test local Next.js API endpoints"""
        print("\n" + "="*60)
        print("LOCAL API ENDPOINT TESTS")
        print("="*60)
        
        endpoints = [
            ("Database Connection", "GET", "/api/test-db", None),
            ("Tour Search", "POST", "/api/tours/search", {
                "destination": "Cape Town",
                "country": "South Africa",
                "adults": 2,
                "children": 0
            }),
            ("Tour Availability", "POST", "/api/tours/availability", {
                "tourId": "tour-001",
                "date": "2024-07-01"
            }),
            ("Create Booking", "POST", "/api/bookings/create", {
                "tourId": "tour-001",
                "startDate": "2024-07-01",
                "endDate": "2024-07-03",
                "adults": 2,
                "children": 0,
                "customerDetails": {
                    "firstName": "Test",
                    "lastName": "User",
                    "email": "test@example.com",
                    "phone": "+27123456789",
                    "address": "Test Address"
                }
            }),
            ("Process Payment", "POST", "/api/payments/process", {
                "amount": 150000,
                "currency": "ZAR",
                "bookingId": "test-booking-001"
            })
        ]
        
        for test_name, method, endpoint, payload in endpoints:
            try:
                start_time = time.time()
                
                if method == "GET":
                    response = requests.get(f"{LOCAL_API_URL}{endpoint}", timeout=30)
                else:
                    response = requests.post(
                        f"{LOCAL_API_URL}{endpoint}",
                        json=payload,
                        headers={'Content-Type': 'application/json'},
                        timeout=30
                    )
                
                response_time = int((time.time() - start_time) * 1000)
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        self.log_result(test_name, True, "Endpoint working correctly", response_time)
                    except json.JSONDecodeError:
                        self.log_result(test_name, True, "Endpoint responded (non-JSON)", response_time)
                else:
                    self.log_result(test_name, False, f"HTTP {response.status_code}", response_time)
                    
            except requests.exceptions.RequestException as e:
                self.log_result(test_name, False, f"Request failed: {str(e)}")
    
    def test_error_scenarios(self):
        """Test error handling scenarios"""
        print("\n" + "="*60)
        print("ERROR HANDLING TESTS")
        print("="*60)
        
        error_tests = [
            ("Invalid Tour ID", "POST", "/api/tours/availability", {
                "tourId": "INVALID_TOUR_ID",
                "date": "2024-07-01"
            }),
            ("Invalid Date Format", "POST", "/api/tours/availability", {
                "tourId": "tour-001",
                "date": "invalid-date"
            }),
            ("Missing Required Fields", "POST", "/api/bookings/create", {
                "tourId": "tour-001"
                # Missing required fields
            }),
            ("Invalid JSON", "POST", "/api/tours/search", "invalid-json"),
        ]
        
        for test_name, method, endpoint, payload in error_tests:
            try:
                start_time = time.time()
                
                headers = {'Content-Type': 'application/json'}
                if isinstance(payload, str):
                    # Test invalid JSON
                    response = requests.post(
                        f"{LOCAL_API_URL}{endpoint}",
                        data=payload,
                        headers=headers,
                        timeout=30
                    )
                else:
                    response = requests.post(
                        f"{LOCAL_API_URL}{endpoint}",
                        json=payload,
                        headers=headers,
                        timeout=30
                    )
                
                response_time = int((time.time() - start_time) * 1000)
                
                # For error tests, we expect either 400-level errors or graceful handling
                if response.status_code >= 400 and response.status_code < 500:
                    self.log_result(test_name, True, f"Properly handled error (HTTP {response.status_code})", response_time)
                elif response.status_code == 200:
                    # Check if response indicates error was handled gracefully
                    try:
                        data = response.json()
                        if 'error' in data or 'message' in data:
                            self.log_result(test_name, True, "Error handled gracefully", response_time)
                        else:
                            self.log_result(test_name, False, "Error not properly handled", response_time)
                    except:
                        self.log_result(test_name, False, "Unexpected response format", response_time)
                else:
                    self.log_result(test_name, False, f"Unexpected status: {response.status_code}", response_time)
                    
            except requests.exceptions.RequestException as e:
                self.log_result(test_name, False, f"Request failed: {str(e)}")
    
    def test_performance(self):
        """Test API performance with multiple requests"""
        print("\n" + "="*60)
        print("PERFORMANCE TESTS")
        print("="*60)
        
        # Test multiple search requests
        search_times = []
        for i in range(5):
            try:
                start_time = time.time()
                response = requests.post(
                    f"{LOCAL_API_URL}/api/tours/search",
                    json={"destination": "Cape Town", "adults": 2},
                    timeout=30
                )
                response_time = int((time.time() - start_time) * 1000)
                search_times.append(response_time)
                
            except requests.exceptions.RequestException:
                pass
        
        if search_times:
            avg_time = sum(search_times) / len(search_times)
            max_time = max(search_times)
            min_time = min(search_times)
            
            self.log_result(
                "Search Performance", 
                avg_time < 5000,  # Pass if average < 5 seconds
                f"Avg: {avg_time:.0f}ms, Min: {min_time}ms, Max: {max_time}ms"
            )
        else:
            self.log_result("Search Performance", False, "No successful requests")
    
    def test_data_validation(self):
        """Test data validation and response formats"""
        print("\n" + "="*60)
        print("DATA VALIDATION TESTS")
        print("="*60)
        
        try:
            # Test tour search response format
            response = requests.post(
                f"{LOCAL_API_URL}/api/tours/search",
                json={"destination": "Cape Town"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if response has expected structure
                if 'tours' in data or 'results' in data or isinstance(data, list):
                    self.log_result("Response Format", True, "Valid JSON structure")
                else:
                    self.log_result("Response Format", False, "Unexpected response structure")
                
                # Check for required fields in tour data
                tours = data.get('tours', data if isinstance(data, list) else [])
                if tours and len(tours) > 0:
                    tour = tours[0]
                    required_fields = ['tourId', 'tourName', 'priceFrom']
                    missing_fields = [field for field in required_fields if field not in tour]
                    
                    if not missing_fields:
                        self.log_result("Tour Data Fields", True, "All required fields present")
                    else:
                        self.log_result("Tour Data Fields", False, f"Missing fields: {missing_fields}")
                else:
                    self.log_result("Tour Data Fields", False, "No tour data returned")
            else:
                self.log_result("Response Format", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_result("Data Validation", False, f"Validation failed: {str(e)}")
    
    def generate_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*60)
        print("TEST REPORT SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print(f"Test Duration: {datetime.now() - self.start_time}")
        
        if failed_tests > 0:
            print(f"\nFailed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        # Save detailed report
        report_data = {
            'summary': {
                'total_tests': total_tests,
                'passed': passed_tests,
                'failed': failed_tests,
                'success_rate': (passed_tests/total_tests)*100,
                'start_time': self.start_time.isoformat(),
                'end_time': datetime.now().isoformat()
            },
            'results': self.test_results
        }
        
        report_filename = f"tourplan_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_filename, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_filename}")
    
    def run_all_tests(self):
        """Run complete test suite"""
        print("🧪 TOURPLAN API COMPREHENSIVE TEST SUITE")
        print("="*60)
        print(f"Started at: {self.start_time}")
        print(f"API Endpoint: {API_BASE_URL}")
        print(f"Local API: {LOCAL_API_URL}")
        print("="*60)
        
        # Run all test categories
        self.test_connectivity()
        self.test_authentication()
        self.test_local_api_endpoints()
        self.test_error_scenarios()
        self.test_performance()
        self.test_data_validation()
        
        # Generate final report
        self.generate_report()

def main():
    """Main function to run tests"""
    print("Make sure your development server is running (npm run dev)")
    print("Make sure your VPN is connected to South Africa")
    print()
    
    # Ask user what tests to run
    print("Select test mode:")
    print("1. Quick test (connectivity + local API)")
    print("2. Full test suite (all tests)")
    print("3. Authentication only")
    print("4. Local API only")
    
    choice = input("Enter choice (1-4) or press Enter for full suite: ").strip()
    
    tester = TourplanTester()
    
    if choice == "1":
        tester.test_connectivity()
        tester.test_local_api_endpoints()
    elif choice == "3":
        tester.test_connectivity()
        tester.test_authentication()
    elif choice == "4":
        tester.test_local_api_endpoints()
    else:
        tester.run_all_tests()
    
    if choice != "2" and choice != "":
        tester.generate_report()

if __name__ == "__main__":
    main()
