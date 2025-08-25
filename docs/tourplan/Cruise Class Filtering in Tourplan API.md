## **Cruise Class Filtering in Tourplan API**

For codes, check: /docs/tourplan/Tourplan Codes-service-button.csv

Cruises are returned via the API with Country \> Destination \> Class filtering capability. Here's how the filtering system works:

### **How the Filtering System Works:**

1. **GetProductSearchData Request**: This is the key request that provides all necessary filtering data for cruise searches. It returns three main elements:  
   * `CodeTables` \- Contains various code tables including class codes  
   * `CountryList` \- Lists countries and their destinations  
   * `ServiceButtons` \- Service button details with associated filtering codes  
2. **Class Codes Structure**:  
   * **CodeTableType**: `CLS` represents the class codes table  
   * Class codes are returned per country/destination combination  
   * Each destination can have different class codes available  
3. **Service Button Structure for Cruises**:  
   * **ButtonName**: "Cruises"  
   * **Button No**: 91 (from the service codes documentation)  
   * **Product Type**: Non Accommodation  
   * **ClassLabel**: Each service button has a ClassLabel field

### **API Structure for Class Filtering:**

| \<GetProductSearchDataReply\>  \<CodeTables\>    \<CodeTable\>      \<CodeTableType\>CLS\</CodeTableType\>  \<\!-- Class codes \--\>      \<CodeTableEntries\>        \<CodeTableEntry\>          \<Code\>LUXURY\</Code\>          \<Description\>Luxury Class\</Description\>        \</CodeTableEntry\>        \<\!-- More class codes... \--\>      \</CodeTableEntries\>    \</CodeTable\>  \</CodeTables\>  \<ServiceButtons\>    \<ServiceButton\>      \<ButtonName\>Cruises\</ButtonName\>      \<ClassLabel\>Class\</ClassLabel\>      \<ButtonCountries\>        \<ButtonCountry\>          \<CountryCode\>ZA\</CountryCode\>          \<DestinationList\>            \<DestinationInfo\>              \<DestinationCode\>WCP\</DestinationCode\>              \<CodeLists\>                \<CodeList\>                  \<CodeTableType\>CLS\</CodeTableType\>                  \<Code\>BASIC\</Code\>                  \<Code\>STANDARD\</Code\>                  \<Code\>LUXURY\</Code\>                \</CodeList\>              \</CodeLists\>            \</DestinationInfo\>          \</DestinationList\>        \</ButtonCountry\>      \</ButtonCountries\>    \</ServiceButton\>  \</ServiceButtons\>\</GetProductSearchDataReply\> |
| :---- |

For Cruise Search Requests:

| \<OptionInfoRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<ButtonName\>Cruises\</ButtonName\>  \<CountryName\>South Africa\</CountryName\>  \<\!-- Country filtering \--\>  \<DestinationName\>Western Cape\</DestinationName\>  \<\!-- Destination filtering \--\>  \<Class\>LUXURY\</Class\>  \<\!-- Class filtering \--\>  \<DateFrom\>2025-07-15\</DateFrom\>  \<RoomConfigs\>    \<RoomConfig\>      \<Adults\>2\</Adults\>      \<RoomType\>CABIN\_TYPE\</RoomType\>    \</RoomConfig\>  \</RoomConfigs\>\</OptionInfoRequest\> |
| :---- |

### **Troubleshooting Your Class Filtering Issues:**

1. **First, get the available class codes**:  
   * Make a `GetProductSearchDataRequest` to get all available class codes for cruises  
   * Check what class codes are actually available for your specific country/destination combinations  
2. **Verify the class codes match exactly**:  
   * The class codes in your search requests must match exactly with what's returned from `GetProductSearchData`  
   * Class codes are case-sensitive  
3. **Check your current implementation**:  
   * Ensure you're using the correct XML element `<Class>` in your `OptionInfoRequest`  
   * Verify the class codes you're using exist in the Tourplan system for cruise products

The filtering system definitely supports Country \> Destination \> Class filtering for cruises, but the specific class codes available depend on what's configured in your Tourplan system for each destination.

