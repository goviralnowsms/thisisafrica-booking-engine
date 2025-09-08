## **Tourplan API Codes for Accommodation Search**

### **Key Parameters:**

1. **ButtonName**: `"Accommodation"`  
   * This is the primary code that identifies you're searching for accommodation  
2. **Info Parameter**: `"GS"`  
   * G \= General product information  
   * S \= Stay pricing information  
   * This combination returns accommodation with pricing for specific dates  
3. **Service Type**: `"Y"`  
   * Indicates room-based pricing (specific to accommodation)  
4. **Button Number**: `10`  
   * The internal button number for accommodation in the Tourplan system

### **Required Fields for Accommodation Search:**

* **RoomConfigs**: Room configuration structure containing:  
  * **Adults**: Number of adults (mandatory)  
  * **Children**: Number of children (optional)  
  * **Infants**: Number of infants (optional)  
  * **RoomType**: Room type code (e.g., "DB" for double, "TW" for twin)  
* **DateFrom**: Check-in date (format: YYYY-MM-DD)  
* **DateTo**: Check-out date (format: YYYY-MM-DD) \- mandatory for accommodation  
* **DestinationName**: Destination to search (optional but recommended)

### **Example XML Request Structure:**

| \<OptionInfoRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<ButtonName\>Accommodation\</ButtonName\>  \<DestinationName\>Bangkok\</DestinationName\>  \<Info\>GS\</Info\>  \<DateFrom\>2025-07-15\</DateFrom\>  \<DateTo\>2025-07-18\</DateTo\>  \<RoomConfigs\>    \<RoomConfig\>      \<Adults\>2\</Adults\>      \<Children\>1\</Children\>      \<RoomType\>DB\</RoomType\>    \</RoomConfig\>  \</RoomConfigs\>\</OptionInfoRequest\> |
| :---- |

### **Additional Search Parameters:**

* **MinimumAvailability**: Controls which options are returned  
  * "OK" \- Only available options  
  * "RQ" \- Available or on request (default)  
  * "NO" \- All options  
* **RateConvert**: Set to "Y" to convert rates to agent's currency

The accommodation search differs from other product types (like Day Tours) in that it requires date ranges and room configurations, and uses stay-based pricing indicated by the "GS" info parameter and "Y" service type.

