## **The Issue with Booking Search**

According to the Tourplan HostConnect API documentation, there are limitations on how you can search for bookings:

### **Current API Capabilities:**

1. **ListBookings Request** \- This endpoint allows searching by:  
   * **Booking Reference** (`Ref` parameter) \- The Tourplan booking reference  
   * **Booking ID** (`BookingId` parameter) \- The unique identifier  
   * **Surname Search** (`NameContains` parameter) \- Searches within the booking name or name alias  
   * Other filters like travel dates, entry dates, agent reference, etc.  
2. **GetBooking Request** \- Retrieves a specific booking using:  
   * **Booking Reference** (`Ref`)  
   * **Booking ID** (`BookingId`)

### **The Challenge:**

The issue you're experiencing is that the API uses different terminology and has specific limitations:

* **Booking ID** vs **Booking Reference**: The API distinguishes between these two. The BookingId is an internal integer identifier, while Ref is the actual booking reference string (max 10 characters).  
* **Name Search**: The `NameContains` parameter in ListBookings searches the "booking name" field, not individual passenger surnames.

### **Recommended Solution:**

For your My Bookings search functionality, you could implement a dual approach:

1. **For Initial Login (Authentication)**:  
   * Use surname \+ booking reference (not ID) as you currently have  
   * Call `ListBookings` with the `NameContains` parameter for surname  
   * Then verify the booking reference matches  
2. **For Search Within My Bookings Area**:

xml  
\<ListBookingsRequest\>  
  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  
  \<Password\>YOUR\_PASSWORD\</Password\>  
  *\<\!-- For surname search \--\>*  
  \<NameContains\>Smith\</NameContains\>  
  *\<\!-- OR for reference search \--\>*  
  \<Ref\>ABC123\</Ref\>

1. \</ListBookingsRequest\>

2. **Implementation Approach**:  
   * When searching by surname: Use `NameContains` parameter  
   * When searching by booking reference: Use `Ref` parameter  
   * You cannot use BookingId for external customer searches as it's an internal identifier

### **Alternative Approach:**

If you need more flexible search capabilities, you might need to:

1. Cache booking data locally after initial retrieval  
2. Implement your own search logic on the cached data  
3. Use `ListBookings` to periodically refresh the cache

### **Important Notes:**

* The `NameContains` search is a substring search, so searching for "Smith" will find "John Smith", "Smithson", etc.  
* The API requires proper authentication (AgentID and Password) for every request  
* Sub-logins can be used to restrict access to specific bookings if needed

**Date Range Filtering**:

// Add to search params

travelDateFrom: '2025-01-01',

travelDateTo: '2025-12-31'

