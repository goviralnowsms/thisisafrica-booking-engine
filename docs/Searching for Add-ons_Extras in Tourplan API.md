## **Searching for Add-ons/Extras in Tourplan API**

For special add-ons like gorilla park permits in Uganda/Rwanda, you'd use the following approach:

1. **First Method \- Service Button Search**: You would use the `OptionInfoRequest` with the `ButtonName` set to "Day Tours" (Button No 96\) to find available activities that might include gorilla trekking.

| \<ButtonName\>Day Tours\</ButtonName\>\<DestinationName\>Uganda\</DestinationName\>\<Info\>D\</Info\> |
| :---- |

You could search for keywords like "gorilla" or "Bwindi" (where gorilla trekking happens) in the returned descriptions.  
**Second Method \- Direct Product Code Search**: If you know the product code for gorilla permits, you can search directly using an `OptionInfoRequest` with the specific `Opt` code:

| \<Opt\>KGLGTXXXBWI001\</Opt\> |
| :---- |

For now, I don’t have any codes for day tours or extras.

Where the code would follow Tourplan's pattern for the gorilla trekking products.

**Using Extras with Bookings**: The Tourplan API supports the concept of "extras" through the `ExtraQuantities` element. When looking at the DTD documentation, I found that the `AddServiceRequest` supports `ExtraQuantities` which contains `ExtraQuantityItem` elements. For a gorilla permit, it would be structured like:

| \<AddServiceRequest\>  \<AgentID\>SAMAGT\</AgentID\>  \<Password\>S@MAgt01\</Password\>  \<\!-- other booking info \--\>  \<ExtraQuantities\>    \<ExtraQuantityItem\>      \<SequenceNumber\>1\</SequenceNumber\>      \<ExtraQuantity\>1\</ExtraQuantity\>    \</ExtraQuantityItem\>  \</ExtraQuantities\>  \<\!-- remaining booking details \--\>\</AddServiceRequest\> |
| :---- |

**Finding Available Extras**: To know what extras are available for a specific product, you need to first run an `OptionInfoRequest` for that product. The response will include available extras with their sequence numbers, which you can then use in the `ExtraQuantities` section when making a booking.

**In Tour Results**: I noticed in your code (from the `tour-results.tsx` file) that you already have an `extras` array in your tour model:

| extras: \[\],// Enhanced dataenhancedData: {  images: tourplanTour.images || \[\],  rates: tourplanTour.rates || \[\],  amenities: tourplanTour.amenities || \[\],  pickupDetails: tourplanTour.pickupDetails || \[\],  cancellationPolicy: tourplanTour.cancellationPolicy,  optionNumber: tourplanTour.optionNumber,  longDescription: tourplanTour.longDescription} |
| :---- |

1. You'll want to populate this `extras` array from the `ServiceExtras` that come back in the API response.

## **Example API Request for Gorilla Permits**

To search for gorilla permits specifically, you could use:

| \<?xml version="1.0"?\>\<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>\<Request\>  \<OptionInfoRequest\>    \<AgentID\>SAMAGT\</AgentID\>    \<Password\>S@MAgt01\</Password\>    \<ButtonName\>Day Tours\</ButtonName\>    \<DestinationName\>Uganda\</DestinationName\>    \<Info\>D\</Info\>    \<Description\>gorilla\</Description\>  \</OptionInfoRequest\>\</Request\> |
| :---- |

This would search for day tours in Uganda with "gorilla" in the description. The API should return available gorilla trekking options, which you can then examine for additional extras like permits.

When you find the relevant tours with gorilla permits, you would:

1. Look for `ServiceExtras` in the response  
2. Map these to your application's extras model  
3. Allow users to select them during the booking process  
4. Include them in the `ExtraQuantities` section when making a booking

