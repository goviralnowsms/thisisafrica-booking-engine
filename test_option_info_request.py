#!/usr/bin/env python3
"""
Tourplan OptionInfoRequest Test
This script tests the OptionInfoRequest functionality for the Tourplan API
using the specific XML format provided by the user.
"""

import requests
import json
import time
from xml.dom import minidom
import re
from datetime import datetime

# API Configuration
API_BASE_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
LOCAL_API_URL = "http://localhost:3000"
AGENT_ID = "SAMAGT"
PASSWORD = "S@MAgt01"

class OptionInfoTester:
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
    
    def test_option_info_request_direct(self):
        """Test OptionInfoRequest directly against Tourplan API"""
        print("\n" + "="*60)
        print("DIRECT TOURPLAN API - OPTION INFO REQUEST TESTS")
        print("="*60)
        
        # Test different Info types: G=General, S=Stay Pricing, R=Rates, A=Availability
        test_cases = [
            ("General Info", "G", "service_button", "Cape Town"),
            ("Stay Pricing", "S", "service_button", "Cape Town"),
            ("Rates Info", "R", "service_button", "Cape Town"),
            ("Availability Info", "A", "service_button", "Cape Town"),
        ]
        
        for test_name, info_type, button_name, destination in test_cases:
            xml_request = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>{AGENT_ID}</AgentID>
    <Password>{PASSWORD}</Password>
    <ButtonName>{button_name}</ButtonName>
    <DestinationName>{destination}</DestinationName>
    <Info>{info_type}</Info>
  </OptionInfoRequest>
</Request>"""

            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }

            try:
                print(f"\n--- Testing {test_name} ---")
                print("Request XML:")
                print(self.pretty_print_xml(xml_request))
                
                start_time = time.time()
                response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)
                response_time = int((time.time() - start_time) * 1000)

                print(f"Response Status: {response.status_code}")
                print("Response XML:")
                print(self.pretty_print_xml(response.text))

                if "<ErrorReply>" in response.text:
                    error_match = re.search(r'<Error>(.*?)</Error>', response.text)
                    error_msg = error_match.group(1) if error_match else "Unknown error"
                    self.log_result(f"{test_name} (Direct API)", False, f"API Error: {error_msg}", response_time)
                elif "<OptionInfoReply>" in response.text:
                    self.log_result(f"{test_name} (Direct API)", True, "OptionInfoRequest successful", response_time)
                else:
                    self.log_result(f"{test_name} (Direct API)", False, "Unexpected response format", response_time)

            except requests.exceptions.RequestException as e:
                self.log_result(f"{test_name} (Direct API)", False, f"Request failed: {str(e)}")
    
    def test_option_info_via_local_api(self):
        """Test OptionInfoRequest via local Next.js API"""
        print("\n" + "="*60)
        print("LOCAL API - OPTION INFO REQUEST TESTS")
        print("="*60)
        
        # Test the new OptionInfo endpoint
        test_cases = [
            ("General Info", "G", "service_button", "Cape Town"),
            ("Stay Pricing", "S", "service_button", "Cape Town"),
            ("Rates Info", "R", "service_button", "Cape Town"),
            ("Availability Info", "A", "service_button", "Cape Town"),
        ]
        
        for test_name, info_type, button_name, destination in test_cases:
            payload = {
                "buttonName": button_name,
                "destinationName": destination,
                "info": info_type
            }
            
            try:
                print(f"\n--- Testing {test_name} via Local API ---")
                print(f"Request payload: {json.dumps(payload, indent=2)}")
                
                start_time = time.time()
                
                # Test the new OptionInfo endpoint
                response = requests.post(
                    f"{LOCAL_API_URL}/api/tourplan/option-info",
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                
                response_time = int((time.time() - start_time) * 1000)
                
                print(f"Response Status: {response.status_code}")
                print(f"Response Body: {response.text}")
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get('success'):
                            self.log_result(f"{test_name} (Local API)", True, "OptionInfo request successful", response_time)
                        else:
                            self.log_result(f"{test_name} (Local API)", False, f"API returned error: {data.get('error', 'Unknown')}", response_time)
                    except json.JSONDecodeError:
                        self.log_result(f"{test_name} (Local API)", False, "Invalid JSON response", response_time)
                else:
                    self.log_result(f"{test_name} (Local API)", False, f"HTTP {response.status_code}", response_time)
                    
            except requests.exceptions.RequestException as e:
                self.log_result(f"{test_name} (Local API)", False, f"Request failed: {str(e)}")
    
    def test_xml_format_validation(self):
        """Test XML format validation"""
        print("\n" + "="*60)
        print("XML FORMAT VALIDATION TESTS")
        print("="*60)
        
        # Test the exact format provided by the user
        user_provided_format = """<OptionInfoRequest>
  <AgentID>agent_id</AgentID>
  <Password>password</Password>
  <ButtonName>service_button</ButtonName>
  <DestinationName>destination</DestinationName>
  <Info>G</Info> <!-- G=General, S=Stay Pricing, R=Rates, A=Availability -->
</OptionInfoRequest>"""
        
        # Test with actual values
        actual_format = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>{AGENT_ID}</AgentID>
    <Password>{PASSWORD}</Password>
    <ButtonName>service_button</ButtonName>
    <DestinationName>Cape Town</DestinationName>
    <Info>G</Info>
  </OptionInfoRequest>
</Request>"""
        
        try:
            # Validate XML structure
            dom = minidom.parseString(actual_format)
            self.log_result("XML Format Validation", True, "XML structure is valid")
            
            print("User provided format (template):")
            print(user_provided_format)
            print("\nActual format with credentials:")
            print(self.pretty_print_xml(actual_format))
            
        except Exception as e:
            self.log_result("XML Format Validation", False, f"XML validation failed: {str(e)}")
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "="*60)
        print("OPTION INFO REQUEST TEST REPORT")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%" if total_tests > 0 else "No tests run")
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
                'success_rate': (passed_tests/total_tests)*100 if total_tests > 0 else 0,
                'start_time': self.start_time.isoformat(),
                'end_time': datetime.now().isoformat()
            },
            'results': self.test_results
        }
        
        report_filename = f"option_info_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_filename, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_filename}")
    
    def run_all_tests(self):
        """Run all OptionInfoRequest tests"""
        print("🧪 TOURPLAN OPTION INFO REQUEST TEST SUITE")
        print("="*60)
        print(f"Started at: {self.start_time}")
        print(f"API Endpoint: {API_BASE_URL}")
        print(f"Local API: {LOCAL_API_URL}")
        print("="*60)
        
        # Run all test categories
        self.test_xml_format_validation()
        self.test_option_info_request_direct()
        self.test_option_info_via_local_api()
        
        # Generate final report
        self.generate_report()

def main():
    """Main function to run OptionInfoRequest tests"""
    print("🔍 TOURPLAN OPTION INFO REQUEST TESTING")
    print("="*60)
    print("This test suite validates the OptionInfoRequest format you provided:")
    print("<OptionInfoRequest>")
    print("  <AgentID>agent_id</AgentID>")
    print("  <Password>password</Password>")
    print("  <ButtonName>service_button</ButtonName>")
    print("  <DestinationName>destination</DestinationName>")
    print("  <Info>G</Info> <!-- G=General, S=Stay Pricing, R=Rates, A=Availability -->")
    print("</OptionInfoRequest>")
    print("="*60)
    print()
    print("Make sure your VPN is connected to South Africa for direct API tests")
    print("Make sure your development server is running (npm run dev) for local API tests")
    print()
    
    # Ask user what tests to run
    print("Select test mode:")
    print("1. XML Format Validation only")
    print("2. Direct Tourplan API tests only")
    print("3. Local API tests only")
    print("4. Full test suite (all tests)")
    
    choice = input("Enter choice (1-4) or press Enter for full suite: ").strip()
    
    tester = OptionInfoTester()
    
    if choice == "1":
        tester.test_xml_format_validation()
    elif choice == "2":
        tester.test_xml_format_validation()
        tester.test_option_info_request_direct()
    elif choice == "3":
        tester.test_option_info_via_local_api()
    else:
        tester.run_all_tests()
    
    if choice != "4":
        tester.generate_report()

if __name__ == "__main__":
    main()
