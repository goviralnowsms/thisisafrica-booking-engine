#!/usr/bin/env python3
"""
Test script to verify the new XML search format for Tourplan API
"""

import requests
import json
from datetime import datetime

def test_search_api():
    """Test the search API with the new XML format"""
    
    # Test data
    search_params = {
        "destination": "Cape Town",
        "startDate": "2025-07-01",
        "adults": 2,
        "children": 0,
        "tourType": "cultural"
    }
    
    print("Testing Search API with new XML format...")
    print(f"Search parameters: {json.dumps(search_params, indent=2)}")
    
    try:
        # Make request to local search API
        response = requests.post(
            "http://localhost:3000/api/tours/search",
            json=search_params,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Found {data.get('totalFound', 0)} tours")
            print(f"Source: {data.get('source', 'unknown')}")
            print(f"Cached: {data.get('cached', False)}")
            
            # Show first few tours
            tours = data.get('tours', [])
            if tours:
                print(f"\nFirst {min(3, len(tours))} tours:")
                for i, tour in enumerate(tours[:3]):
                    print(f"  {i+1}. {tour.get('name', 'Unknown')} - ${tour.get('price', 0)}")
                    print(f"     Location: {tour.get('location', 'Unknown')}")
                    print(f"     Availability: {tour.get('availability', 'Unknown')}")
            else:
                print("\nNo tours returned")
                
        else:
            print(f"Error: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error text: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to localhost:3000")
        print("Make sure the Next.js development server is running with 'npm run dev'")
    except Exception as e:
        print(f"Error: {e}")

def test_xml_format():
    """Test the XML format generation"""
    print("\n" + "="*50)
    print("Testing XML Format Generation")
    print("="*50)
    
    # Expected XML format
    expected_xml = """<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <ButtonName>Day Tours</ButtonName>
    <DestinationName>Cape Town</DestinationName>
    <Info>GS</Info>
    <DateFrom>2025-07-01</DateFrom>
    <RateConvert>Y</RateConvert>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>"""
    
    print("Expected XML format:")
    print(expected_xml)
    print("\nThis format should now be used instead of the previous SOAP format.")

if __name__ == "__main__":
    test_xml_format()
    test_search_api()
