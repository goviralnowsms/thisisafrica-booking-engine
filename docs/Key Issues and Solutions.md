## **Key Issues and Solutions**

### **1\. Service Button Configuration is Critical**

Based on your System Setup documentation, Service Buttons are the foundation for product categorization. Here's what needs to be properly configured:

| \<\!-- Each product MUST have a ButtonName that matches a configured Service Button \--\>\<ButtonName\>Day Tours\</ButtonName\>  \<\!-- Must match EXACTLY \--\> |
| :---- |

From your documentation, common Service Button names include:

* Day Tours  
* Accommodation  
* Cruises  
* Rail  
* Packages  
* Special Offers

### **2\. Required Code Tables**

Your system needs these code tables properly populated:

#### **Location Codes (3 characters)**

* Example: `AKL` \- Auckland, `SYD` \- Sydney  
* Required for every product

#### **Service Type Codes (2 characters)**

* `AC` \- Accommodation  
* `TR` \- Transportation  
* `SS` \- Sightseeing  
* Must be created in Code Setup \> Product \> Service

#### **Supplier Codes (6 characters)**

* Example: `HERA01` \- Heritage Auckland Hotel  
* Must be created in Creditors/Supplier Setup  
* Requires at least a default currency to be set up first

### **3\. Product Code Structure**

Products in Tourplan follow this structure:

| \<\!-- OptionInfoRequest must include \--\>\<ButtonName\>Day Tours\</ButtonName\>        \<\!-- Must match configured button \--\>\<DestinationName\>Bangkok\</DestinationName\> \<\!-- Must exist in destinations \--\>\<DateFrom\>2013-09-14\</DateFrom\>           \<\!-- Valid date range \--\>\<DateTo\>2014-09-14\</DateTo\>\<\!-- Product must have \--\>\- Valid location code (3 chars)\- Valid service type (2 chars)  \- Valid supplier code (6 chars)\- Valid product code\- Active rates for the date range\- Proper ButtonName assignment |
| :---- |

### **6\. INI Settings to Check**

Critical INI settings from your documentation:

| DST\_ENABLED \= Yes           \# Enable destinationsCTR\_ENABLED \= Yes          \# Enable countries  SERVICE\_IT\_STATUS \= IT     \# Default initial statusBASECURRENCY \= USD         \# Or your base currency |
| :---- |

### **7\. Diagnostic API Call**

Use this to see what's configured:

| \<?xml version="1.0"?\>\<\!DOCTYPE Request SYSTEM "hostConnect\_3\_00\_000.dtd"\>\<Request\>  \<GetProductSearchDataRequest\>    \<AgentID\>AATRAV\</AgentID\>    \<Password\>AATRAV\</Password\>  \</GetProductSearchDataRequest\>\</Request\> |
| :---- |

This returns all valid:

* Service Buttons  
* Destinations  
* Locations  
* Service Types  
* Available code combinations

### **8\. Product Setup Workflow**

Based on your Product manual, the correct setup order is:

1. **Create Currency** (Code Setup \> System \> Currency)  
2. **Create Locations** (Code Setup \> Product \> Location)  
3. **Create Service Types** (Code Setup \> Product \> Service)  
4. **Create Suppliers** (Financials \> Creditors or Product \> Supplier Setup)  
5. **Create Products** (Product \> Product Setup)  
6. **Add Rates** to products with valid date ranges  
7. **Map to Service Buttons** via ButtonName field

### **9\. Quick Fix Checklist**

If products aren't showing:

1. Check ButtonName matches exactly  
2. Verify destination exists and is mapped  
3.  Ensure location code is valid (3 chars)  
4.  Confirm service type exists (2 chars)  
5.  Check supplier is active  
6.  Verify rates exist for the search date range  
7.  Ensure product isn't flagged as deleted  
8.  Check service status isn't set to cancelled (XX)

### **10\. Most Common Solution**

Based on the documentation, the most common reason products don't appear is:

**Missing or incorrect ButtonName mapping**

To fix:

1. Check what Service Buttons are configured  
2. Ensure each product has the correct ButtonName  
3. Verify the ButtonName spelling matches EXACTLY (case-sensitive)

