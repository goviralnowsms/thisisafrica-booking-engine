#!/usr/bin/env python3
"""
Test the specific OptionInfoRequest XML format provided by the user
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

class UserOptionInfoTester:
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
    
    def test_user_xml_format_direct(self):
        """Test the exact XML format provided by the user against Tourplan API"""
        print("\n" + "="*60)
        print("TESTING USER'S EXACT XML FORMAT - DIRECT API")
        print("="*60)
        
        # The exact XML format provided by the user, with real credentials
        xml_request = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>{AGENT_ID}</AgentID>
    <Password>{PASSWORD}</Password>
    <Opt>option_identifier</Opt>
    <Info>GS</Info>
    <DateFrom>2024-01-01</DateFrom>
    <DateTo>2024-01-05</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>"""

        headers = {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        }

        try:
            print("Testing User's XML Format:")
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
                self.log_result("User XML Format (Direct API)", False, f"API Error: {error_msg}", response_time)
            elif "<OptionInfoReply>" in response.text:
                self.log_result("User XML Format (Direct API)", True, "OptionInfoRequest successful", response_time)
            else:
                self.log_result("User XML Format (Direct API)", False, "Unexpected response format", response_time)

        except requests.exceptions.RequestException as e:
            self.log_result("User XML Format (Direct API)", False, f"Request failed: {str(e)}")
    
    def test_user_xml_via_local_api(self):
        """Test the user's XML format via local Next.js API"""
        print("\n" + "="*60)
        print("TESTING USER'S XML FORMAT - LOCAL API")
        print("="*60)
        
        # Convert user's XML structure to JSON payload for local API
        payload = {
            "opt": "option_identifier",
            "info": "GS",
            "dateFrom": "2024-01-01",
            "dateTo": "2024-01-05",
            "roomConfigs": [
                {
                    "adults": 2,
                    "roomType": "DB"
                }
            ]
        }
        
        try:
            print("Testing User's Format via Local API:")
            print(f"Request payload: {json.dumps(payload, indent=2)}")
            
            start_time = time.time()
            
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
                        self.log_result("User XML Format (Local API)", True, "OptionInfo request successful", response_time)
                    else:
                        self.log_result("User XML Format (Local API)", False, f"API returned error: {data.get('error', 'Unknown')}", response_time)
                except json.JSONDecodeError:
                    self.log_result("User XML Format (Local API)", False, "Invalid JSON response", response_time)
            else:
                self.log_result("User XML Format (Local API)", False, f"HTTP {response.status_code}", response_time)
                
        except requests.exceptions.RequestException as e:
            self.log_result("User XML Format (Local API)", False, f"Request failed: {str(e)}")
    
    def test_xml_variations(self):
        """Test variations of the user's XML format"""
        print("\n" + "="*60)
        print("TESTING XML FORMAT VARIATIONS")
        print("="*60)
        
        # Test different Info values
        info_variations = [
            ("General Search", "GS"),
            ("General", "G"),
            ("Stay Pricing", "S"),
            ("Rates", "R"),
            ("Availability", "A")
        ]
        
        for test_name, info_value in info_variations:
            xml_request = f"""<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>{AGENT_ID}</AgentID>
    <Password>{PASSWORD}</Password>
    <Opt>option_identifier</Opt>
    <Info>{info_value}</Info>
    <DateFrom>2024-01-01</DateFrom>
    <DateTo>2024-01-05</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>"""

            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }

            try:
                print(f"\n--- Testing {test_name} (Info={info_value}) ---")
                
                start_time = time.time()
                response = requests.post(API_BASE_URL, data=xml_request, headers=headers, timeout=30)
                response_time = int((time.time() - start_time) * 1000)

                print(f"Response Status: {response.status_code}")
                
                if "<ErrorReply>" in response.text:
                    error_match = re.search(r'<Error>(.*?)</Error>', response.text)
                    error_msg = error_match.group(1) if error_match else "Unknown error"
                    self.log_result(f"{test_name} Variation", False, f"API Error: {error_msg}", response_time)
                    print(f"Error: {error_msg}")
                elif "<OptionInfoReply>" in response.text:
                    self.log_result(f"{test_name} Variation", True, "OptionInfoRequest successful", response_time)
                    print("✅ Success - OptionInfoReply received")
                else:
                    self.log_result(f"{test_name} Variation", False, "Unexpected response format", response_time)
                    print("❌ Unexpected response format")

            except requests.exceptions.RequestException as e:
                self.log_result(f"{test_name} Variation", False, f"Request failed: {str(e)}")
                print(f"❌ Request failed: {str(e)}")
    
    def validate_xml_structure(self):
        """Validate the XML structure"""
        print("\n" + "="*60)
        print("XML STRUCTURE VALIDATION")
        print("="*60)
        
        xml_template = """<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>agent_id</AgentID>
    <Password>password</Password>
    <Opt>option_identifier</Opt>
    <Info>GS</Info>
    <DateFrom>2024-01-01</DateFrom>
    <DateTo>2024-01-05</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>"""
        
        try:
            dom = minidom.parseString(xml_template)
            self.log_result("XML Structure Validation", True, "XML structure is valid")
            
            print("User's XML Template:")
            print(self.pretty_print_xml(xml_template))
            
        except Exception as e:
            self.log_result("XML Structure Validation", False, f"XML validation failed: {str(e)}")
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "="*60)
        print("USER OPTION INFO REQUEST TEST REPORT")
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
        
        report_filename = f"user_option_info_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_filename, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_filename}")
    
    def run_all_tests(self):
        """Run all tests for the user's XML format"""
        print("🧪 USER'S OPTION INFO REQUEST TEST SUITE")
        print("="*60)
        print(f"Started at: {self.start_time}")
        print(f"API Endpoint: {API_BASE_URL}")
        print(f"Local API: {LOCAL_API_URL}")
        print("="*60)
        print("Testing this XML format:")
        print("""<OptionInfoRequest>
  <AgentID>agent_id</AgentID>
  <Password>password</Password>
  <Opt>option_identifier</Opt>
  <Info>GS</Info>
  <DateFrom>2024-01-01</DateFrom>
  <DateTo>2024-01-05</DateTo>
  <RoomConfigs>
    <RoomConfig>
      <Adults>2</Adults>
      <RoomType>DB</RoomType>
    </RoomConfig>
  </RoomConfigs>
</OptionInfoRequest>""")
        print("="*60)
        
        # Run all test categories
        self.validate_xml_structure()
        self.test_user_xml_format_direct()
        self.test_user_xml_via_local_api()
        self.test_xml_variations()
        
        # Generate final report
        self.generate_report()

def main():
    """Main function to run the user's OptionInfoRequest tests"""
    print("🔍 TESTING USER'S OPTION INFO REQUEST FORMAT")
    print("="*60)
    print("This will test your specific XML format with:")
    print("- Opt (option identifier)")
    print("- Info (GS)")
    print("- DateFrom/DateTo (date range)")
    print("- RoomConfigs (room configuration)")
    print("="*60)
    print()
    print("Make sure your VPN is connected to South Africa for direct API tests")
    print("Make sure your development server is running (npm run dev) for local API tests")
    print()
    
    # Ask user what tests to run
    print("Select test mode:")
    print("1. XML Structure Validation only")
    print("2. Direct Tourplan API test only")
    print("3. Local API test only")
    print("4. XML Variations test only")
    print("5. Full test suite (all tests)")
    
    choice = input("Enter choice (1-5) or press Enter for full suite: ").strip()
    
    tester = UserOptionInfoTester()
    
    if choice == "1":
        tester.validate_xml_structure()
    elif choice == "2":
        tester.validate_xml_structure()
        tester.test_user_xml_format_direct()
    elif choice == "3":
        tester.test_user_xml_via_local_api()
    elif choice == "4":
        tester.test_xml_variations()
    else:
        tester.run_all_tests()
    
    if choice != "5":
        tester.generate_report()

if __name__ == "__main__":
    main()
