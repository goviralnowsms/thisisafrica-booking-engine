Amenities:

## **XML Structure for Amenities**

### **1\. Amenities are Returned in the API Response**

Yes, amenities are returned via the API. The XML structure for amenities in the response includes:

| \<Amenities\>  \<Amenity\>    \<AmenityLevel\>O\</AmenityLevel\>  \<\!-- O for Option level, S for Supplier level \--\>    \<AmenityCode\>ROBE\</AmenityCode\>    \<AmenityCategory\>RM\</AmenityCategory\>    \<AmenityDescription\>Bathrobe and slippers\</AmenityDescription\>  \</Amenity\>  \<Amenity\>    \<AmenityLevel\>S\</AmenityLevel\>    \<AmenityCode\>SWIM\</AmenityCode\>    \<AmenityCategory\>AC\</AmenityCategory\>    \<AmenityDescription\>Swimming Pool\</AmenityDescription\>  \</Amenity\>\</Amenities\> |
| :---- |

### **2\. Amenity Levels**

There are two amenity levels:

* **`S`** \- Supplier level amenities (available across the property/supplier)  
* **`O`** \- Option level amenities (specific to a room type or option)

### **3\. OptionInfoRequest Parameters for Getting Amenities**

To retrieve amenities in your OptionInfoRequest, you need to include the appropriate `Info` parameter values:

| \<?xml version="1.0"?\>\<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>\<Request\>  \<OptionInfoRequest\>    \<AgentID\>AGENTID\</AgentID\>    \<Password\>PASSWORD\</Password\>    \<ButtonName\>Accommodation\</ButtonName\>    \<DestinationName\>Bangkok\</DestinationName\>    \<Info\>GMFT\</Info\>  \<\!-- Key parameter for getting amenities \--\>  \</OptionInfoRequest\>\</Request\> |
| :---- |

### 4\. Info Parameter Values

### The `Info` parameter controls what data is returned. For amenities, you need:

* ### `G` \- General product information

* ### `M` \- Media/images

* ### `F` \- Features (includes amenities)

* ### `T` \- Text/descriptions

* ### `D` \- Tariff/rate information

### Common combinations:

* ### `GMFT` \- Returns general info, media, features (amenities), and text

* ### `GMFTD` \- Includes rates as well

### 5\. Amenity Categories

### Common amenity categories include:

* ### `RM` \- Room amenities

* ### `SR` \- Service room amenities

* ### `AC` \- Activity/facility amenities

* ### `SA` \- Service amenities

### 6\. Filtering Implementation Considerations

### For your booking engine, you'll want to:

1. ### Parse amenities from the response when using `Info` values that include `F`

2. ### Store amenity codes and descriptions for filtering

3. ### Group amenities by category for better UI organization

4. ### Distinguish between supplier and option level amenities

### 7\. Example Request for Specific Product with Amenities

### 

| \<?xml version="1.0"?\>\<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>\<Request\>  \<OptionInfoRequest\>    \<AgentID\>AATRAV\</AgentID\>    \<Password\>AATRAV\</Password\>    \<Opt\>BKKACAMARIA??????\</Opt\>  \<\!-- Specific product code \--\>    \<Info\>GMFTD\</Info\>  \<\!-- Get all info including amenities \--\>    \<NotesInRtf\>H\</NotesInRtf\>  \<\!-- HTML formatted notes \--\>  \</OptionInfoRequest\>\</Request\> |
| :---- |

### **Implementation Tips:**

1. **Always include `F` in the Info parameter** to receive amenity data  
2. **Parse both supplier and option level amenities** for complete filtering  
3. **Amenity codes vary by Tourplan system**, so build a mapping for user-friendly display  
4. **Consider caching amenity data** as it doesn't change frequently  
5. **Note that amenities are returned but not used as search criteria** in the initial OptionInfoRequest \- they're for display and client-side filtering after results are received

The amenities will be included in the OptionInfoReply within each Option or Supplier element, allowing you to display and filter results based on available amenities in your booking engine interface.

