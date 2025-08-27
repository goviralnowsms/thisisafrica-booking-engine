## **Cruise Search Capability**

According to your Product Requirements Document, cruise searches are:

1. **Explicitly supported** \- The API documentation lists "Cruises" as one of the supported ButtonName values for the OptionInfoRequest endpoint  
2. **Currently in development** \- The document shows cruise functionality is in the "Short Term (Next Month)" development priorities, marked as 📋 (planned)  
3. **Technically specified** \- The API structure for cruise searches is documented:

| \<ButtonName\>Cruises\</ButtonName\>\<DateFrom\>2025-07-15\</DateFrom\>\<RoomConfigs\>  \<RoomConfig\>    \<Adults\>2\</Adults\>    \<RoomType\>CABIN\_TYPE\</RoomType\>  \</RoomConfig\>\</RoomConfigs\> |
| :---- |

## **Current Status**

The documentation indicates:

* **Phase 2.2**: Cruise Search is part of the "Individual Search Types" phase (currently in development)  
* Required features include:  
  * Cabin configurations  
  * Departure dates  
  * Duration handling  
  * Passenger details  
  * Fixed-length package handling

## **Why Different Answers?**

You might be getting different answers because:

1. **Development status** \- While the API supports cruise searches, your specific implementation might still be under development  
2. **API capabilities vs implementation** \- The Tourplan API itself supports cruise searches, but your booking engine might not have this feature fully implemented yet  
3. **Product availability** \- The API might support the functionality, but actual cruise inventory availability could vary

To definitively confirm if cruise searches are working in your current implementation, you should test the API directly with the cruise-specific parameters shown above.

