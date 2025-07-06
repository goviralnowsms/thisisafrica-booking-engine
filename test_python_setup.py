#!/usr/bin/env python3
"""
Python API Testing Setup Verification
This script verifies that all required packages are installed and working.
"""

import sys
import requests
import xml.etree.ElementTree as ET
from lxml import etree
import json

def test_python_setup():
    """Test that Python and required packages are working correctly."""
    
    print("=" * 50)
    print("Python API Testing Setup Verification")
    print("=" * 50)
    
    # Check Python version
    print(f"✅ Python Version: {sys.version}")
    
    # Check requests package
    try:
        print(f"✅ requests package: v{requests.__version__}")
        
        # Test a simple HTTP request
        response = requests.get("https://httpbin.org/json", timeout=10)
        if response.status_code == 200:
            print("✅ HTTP requests working correctly")
        else:
            print(f"⚠️  HTTP request returned status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing requests: {e}")
    
    # Check XML parsing capabilities
    try:
        # Test built-in xml.etree.ElementTree
        xml_data = "<test><item>Hello World</item></test>"
        root = ET.fromstring(xml_data)
        item_text = root.find('item').text
        print(f"✅ xml.etree.ElementTree working: {item_text}")
        
        # Test lxml
        from lxml import __version__ as lxml_version
        print(f"✅ lxml package: v{lxml_version}")
        
        # Test lxml parsing
        lxml_root = etree.fromstring(xml_data.encode())
        lxml_item = lxml_root.find('item').text
        print(f"✅ lxml parsing working: {lxml_item}")
        
    except Exception as e:
        print(f"❌ Error testing XML parsing: {e}")
    
    # Test JSON handling
    try:
        test_data = {"test": "data", "number": 123}
        json_string = json.dumps(test_data)
        parsed_data = json.loads(json_string)
        print(f"✅ JSON handling working: {parsed_data}")
    except Exception as e:
        print(f"❌ Error testing JSON: {e}")
    
    print("\n" + "=" * 50)
    print("Setup verification complete!")
    print("You're ready to test APIs with Python!")
    print("=" * 50)

if __name__ == "__main__":
    test_python_setup()
