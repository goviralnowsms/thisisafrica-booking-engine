# Email Content for Tourplan Support

**Subject:** SOAP Search API IP Whitelisting Request - Access Denied

---

Dear Tourplan Support,

I am working with the Tourplan API integration and need to request IP whitelisting for the SOAP Search API endpoint.

## Current Status

- **IP Address:** 84.46.231.251 (successfully whitelisted for HostConnect XML API)
- **Agent Credentials:** SAMAGT  

### ✅ HostConnect XML API (Working)
- **URL:** https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
- **Format:** HostConnect XML
- **Status:** IP 84.46.231.251 successfully whitelisted
- **Working Requests:** AgentInfoRequest, OptionInfoRequest

### ❌ SOAP Search API (Access Denied)
- **URL:** https://pa-thisis.nx.tourplan.net/soap/search
- **Format:** SOAP envelope
- **Status:** Access denied - IP not whitelisted for this endpoint

## Issue Description

I have successfully implemented HostConnect XML API functionality (AgentInfo, OptionInfo requests), but I need access to the SOAP Search API for tour search functionality. My IP address is whitelisted for the HostConnect XML API but appears to not be whitelisted for the separate SOAP Search API endpoint.

## Initial Confusion (Resolved)

Initially, I was sending SOAP requests to the HostConnect XML endpoint and receiving format errors:
\`\`\`xml
<Error>1000 SCN System.InvalidOperationException: There is an error in XML document (2, 2). 
(&lt;Envelope xmlns='http://schemas.xmlsoap.org/soap/envelope/'&gt; was not expected.)</Error>
\`\`\`

This has been resolved - I now understand there are separate endpoints for different API formats.

## Current Request

**Primary Request:** Please whitelist IP address **84.46.231.251** for the **SOAP Search API endpoint**

**Expected SOAP Request Format:**
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

## Questions for Clarification

1. **Is https://pa-thisis.nx.tourplan.net/soap/search the correct SOAP Search API endpoint?**

2. **What is the correct SOAP request format for tour searches?**
   - Authentication method in SOAP header
   - Available search parameters
   - Expected response format

3. **Are there any additional endpoints that need whitelisting for full search functionality?**

## Technical Details

- **HostConnect XML Endpoint:** https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi ✅ Working
- **SOAP Search Endpoint:** https://pa-thisis.nx.tourplan.net/soap/search ❌ Access Denied
- **IP Address:** 84.46.231.251
- **Agent ID:** SAMAGT
- **Request Method:** POST
- **Content-Type:** text/xml; charset=utf-8

I have attached complete test results showing the access denied error for your technical team to review.

Thank you for your assistance in whitelisting the SOAP Search API endpoint.

Best regards,  
[Your Name]  
[Your Company]  
[Your Contact Information]

---

## Attachments

**Files:** Test results showing the exact access denied error from the SOAP Search API endpoint.

This will help your technical team verify the whitelisting requirements for the SOAP Search API.
