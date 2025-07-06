# Email Content for Tourplan Support

**Subject:** API Format Clarification - SOAP vs HostConnect XML for Search Functionality

---

Dear Tourplan Support,

I am working with the Tourplan API integration and need clarification on the correct API format for search functionality.

## Current Status

- **IP Address:** 84.46.231.251 (successfully whitelisted)
- **Agent Credentials:** SAMAGT
- **HostConnect XML API:** ✅ Working successfully (AgentInfoRequest, OptionInfoRequest)
- **Search Functionality:** ❌ Encountering format issues

## Issue Description

I am trying to implement tour search functionality and have been attempting to use SOAP format based on some documentation, but I'm receiving XML parsing errors indicating that SOAP envelopes are not expected.

## Error Details

### Request Sent:
\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <Authentication>
      <Username>SAMAGT</Username>
      <Password>S@MAgt01</Password>
      <AgentId>SAMAGT</AgentId>
    </Authentication>
  </soap:Header>
  <soap:Body>
    <SearchTours>
      <Country>South Africa</Country>
      <Destination>Cape Town</Destination>
      <IncludeCancellationDeadlines>true</IncludeCancellationDeadlines>
    </SearchTours>
  </soap:Body>
</soap:Envelope>
\`\`\`

### Error Response:
\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE Reply SYSTEM "hostConnect_5_05_000.dtd">
<Reply>
  <ErrorReply>
    <Error>1000 SCN System.InvalidOperationException: There is an error in XML document (2, 2).
    (&lt;Envelope xmlns='http://schemas.xmlsoap.org/soap/envelope/'&gt; was not expected.)</Error>
  </ErrorReply>
</Reply>
\`\`\`

## Questions

1. **Does the HostConnect API support SOAP format for search requests?**
   - If yes, what is the correct SOAP endpoint URL?
   - If no, what is the correct HostConnect XML format for search requests?

2. **What is the correct XML structure for tour search requests using HostConnect format?**
   - Should it follow the same pattern as AgentInfoRequest and OptionInfoRequest?
   - What are the available search parameters and their XML element names?

3. **Are there separate endpoints for different types of requests?**
   - One for HostConnect XML (AgentInfo, OptionInfo, etc.)
   - One for SOAP-based search requests
   - Or does everything use the same endpoint with different XML formats?

## Request for Documentation

Could you please provide:
- The correct XML format for tour search requests
- A sample search request and response
- Complete list of available search parameters
- Any additional endpoints I should be using

## Technical Details

- **API Endpoint Used:** https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
- **Request Method:** POST
- **Content-Type:** text/xml; charset=utf-8
- **Response Status:** 200 (but with error content)

I have attached the complete request/response details in JSON format for your reference.

Thank you for your assistance in clarifying the correct API format for search functionality.

Best regards,
[Your Name]
[Your Company]
[Your Contact Information]

---

## Attachment

**File:** `soap_search_error_for_tourplan_20250625_150854.json`

This file contains the complete request headers, body, response headers, and response body for your technical team to review.
