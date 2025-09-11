

MY INITIAL EMAIL:

Hi Tourplan support,

We have a working booking engine for group tours, packages, rail and cruise tours. But for accommodation, we are returning no results for all searches.

Pat has explained that in Accommodation the data such as detailed description is generally stored in the Supplier (Hotel) (unlike group tours etc that have product codes).   
Can you please check the attached XML (/docs/Tourplan API Codes for Accommodation Search.md) and what we have tried?

**TOURPLAN REPLY:**

As I advised you previously in ticket \#793526, please try using:  
\<ButtonDestinations\>  
\<ButtonDestination\>  
\<ButtonName\>\</ButtonName\>  
\<DestinationName\>\</DestinationName\>  
\</ButtonDestination\>  
\</ButtonDestinations\>

Also keep in mind that for Info S to return results the rate should be in Rate Status Confirmed and should not have a zero rate.

Using the below should return results

\<?xml version="1.0"?\>

\<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>

\<Request\>  
\<OptionInfoRequest\>  
\<AgentID\>SAMAGT\</AgentID\>  
\<Password\>S@MAgt01\</Password\>  
\<ButtonDestinations\>  
\<ButtonDestination\>  
\<ButtonName\>Accommodation\</ButtonName\>  
\<DestinationName\>Kenya\</DestinationName\>  
\</ButtonDestination\>  
\</ButtonDestinations\>  
\<Info\>GS\</Info\>  
\<DateFrom\>2025-07-15\</DateFrom\>  
\<DateTo\>2025-07-18\</DateTo\>  
\<RoomConfigs\>  
\<RoomConfig\>  
\<Adults\>2\</Adults\>  
\<Children\>0\</Children\>  
\<RoomType\>DB\</RoomType\>  
\</RoomConfig\>  
\</RoomConfigs\>  
\</OptionInfoRequest\>  
\</Request\>

**MY EMAIL:**

The ButtonDestinations structure (exactly your XML) does not return any results via the API for us. We have tried multiple destinations.

 ButtonDestinations Structure (TourPlan recommended approach):

* Returns completely empty results for general accommodation searches

  \- All destinations tested (Kenya, Tanzania, South Africa, Cape Town, Botswana) returned:  
  \<Reply\>\<OptionInfoReply /\>\</Reply\>

  Direct Product Code Searches:  
  \-  Info="G" works perfectly \- returns full hotel details (supplier name, description, room types, etc.)  
  \-  Info="DI" works \- returns basic availability data  
  \-  Info="S" and Info="GSI" return empty \- this matches your email about rates needing to be  
  "confirmed and not zero rate"

The API doesn't seem to have accommodation products/suppliers configured for general destination-based searches.          
    
Even with the recommended ButtonDestinations structure, we get zero results.

  What DOES work:  
  \- If we know the specific accommodation product code (like CPTACPOR002PORTST), direct searches work  
   
We're getting either zero results (for general searches) or complete results (ONLY for specific product codes). 

**TOURPLAN REPLY:**

can you please confirm that the only issue you have is when doing a search and using 'S', and all other searches returns results as expected?

If so then the issue is that there are valid Confirmed rates loaded for the date you are searching

**MY EMAIL:** 

Hi Thys,

The issue is not just with Info='S' \- our testing shows that ButtonDestinations searches return zero accommodation products entirely, even with Info='GS' as recommended in your sample XML. We tested multiple destinations (Kenya, Tanzania, South Africa, Cape Town) and all return empty results.

  Direct product searches (with specific codes like CPTACPOR002PORTST) work with Info='G' but fail with any  rate-related Info values ('S', 'GS', 'GSI').

  The main issue appears to be that accommodation products don't appear to be configured for destination-base searching, not just the rate confirmation status. All other categories work perfectly.

TOURPLAN REPLY:

Info specifies the categories of option data to return. One letter is used to specify each category of data are available, and any combination of the available letters can be specified:  
G (general),  
A (availability),  
I (detailed availability),  
E (full availability),  
R (rates),  
S (stay pricing and availability),  
D (rate date ranges),  
B (package details),  
N (enquiry notes),  
T (multiple enquiry notes),  
F (FYIs),  
M (amenities),  
L (supplier replicated locations, LocationCodes only),  
P (supplier replicated locations, LocationCodes with pickup points, option pickup points),  
V (replicated locations encountered in search).

If the Info data item is empty, or is omitted, then only option identifiers and ValidLocations are returned. Note that only one of the rate types ( R , S , D ) can be asked for. Also, if S is asked for then no A or E or I data is returned.

If info G returns data and info S does not, if you try doing info GS no data will return as there is no data for S.  
So any combination you do with S will return blank.

Once you have valid stay pricing (a Confirmed rate status that is not zero) then you would get results returning.

I see that product CPTACPOR002PORTST was updated with a Confirmed Rate Status with valid rates for 01-Jan-2026 \- 31-Dec-2026

Please try the below and let me know if you get any results returning.

\<?xml version="1.0"?\>  
\<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>  
\<Request\>  
\<OptionInfoRequest\>  
\<AgentID\>SAMAGT\</AgentID\>  
\<Password\>S@MAgt01\</Password\>  
\<ButtonDestinations\>  
\<ButtonDestination\>  
\<ButtonName\>Accommodation\</ButtonName\>  
\<DestinationName\>South Africa\</DestinationName\>  
\</ButtonDestination\>  
\</ButtonDestinations\>  
\<Info\>GS\</Info\>  
\<DateFrom\>2026-07-15\</DateFrom\>  
\<DateTo\>2026-07-18\</DateTo\>  
\<RoomConfigs\>  
\<RoomConfig\>  
\<Adults\>2\</Adults\>  
\<Children\>0\</Children\>  
\<RoomType\>DB\</RoomType\>  
\</RoomConfig\>  
\</RoomConfigs\>  
\</OptionInfoRequest\>  
\</Request\>