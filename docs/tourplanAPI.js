const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TOURPLAN_API_URL = 'https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi';
const AGENT_ID = 'SAMAGT';
const PASSWORD = 'S@MAgt01'; // Consider using environment variables for credentials

// Set this to true to use mock responses instead of making real API calls
const USE_MOCKS = true;
const MOCK_DELAY = 500; // Simulate network delay in milliseconds

// Create mock directory if it doesn't exist
const mockDir = path.join(__dirname, 'mocks');
if (USE_MOCKS && !fs.existsSync(mockDir)) {
  try {
    fs.mkdirSync(mockDir, { recursive: true });
    console.log('Created mock directory:', mockDir);
  } catch (err) {
    console.error('Error creating mock directory:', err);
  }
}

// Helper function to save mock responses
function saveMockResponse(requestType, requestData, responseData) {
  if (!USE_MOCKS) return;
  
  try {
    const filename = path.join(mockDir, `${requestType}.json`);
    fs.writeFileSync(filename, JSON.stringify({ request: requestData, response: responseData }, null, 2));
    console.log(`Mock response saved to ${filename}`);
  } catch (err) {
    console.error('Error saving mock response:', err);
  }
}

// Helper function to get mock responses
function getMockResponse(requestType) {
  try {
    const filename = path.join(mockDir, `${requestType}.json`);
    if (fs.existsSync(filename)) {
      const mockData = JSON.parse(fs.readFileSync(filename, 'utf8'));
      console.log(`Using mock response from ${filename}`);
      return mockData.response;
    }
  } catch (err) {
    console.error('Error reading mock response:', err);
  }
  return null;
}

async function sendRequest(xmlRequest, requestType) {
  // Extract request type for mocking if not provided
  if (!requestType) {
    const match = xmlRequest.match(/<(\w+)Request>/);
    requestType = match ? match[1] : 'unknown';
  }
  
  // Check if we should use mock response
  if (USE_MOCKS) {
    const mockResponse = getMockResponse(requestType);
    if (mockResponse) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      return mockResponse;
    }
    console.log(`No mock found for ${requestType}, will make actual API call and save response`);
  }
  
  try {
    console.log('Sending request to:', TOURPLAN_API_URL);
    console.log('Request body:', xmlRequest);
    
    const response = await axios.post(
      TOURPLAN_API_URL,
      xmlRequest,
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Save successful response as mock for future use
    if (USE_MOCKS) {
      saveMockResponse(requestType, xmlRequest, response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('TourPlan API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Example function for getting service button details
async function getServiceButtonDetails(buttonName) {
  const xmlRequest = `<?xml version="1.0"?><!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
  <Request>
    <GetServiceButtonDetailsRequest>
      <AgentID>${AGENT_ID}</AgentID>
      <Password>${PASSWORD}</Password>
      <ButtonName>${buttonName}</ButtonName>
    </GetServiceButtonDetailsRequest>
  </Request>`;
  
  return sendRequest(xmlRequest, 'GetServiceButtonDetails');
}

// Function to initiate Tyro payment processing
async function initiatePayment(bookingData) {
  // For mock mode, return a simulated Tyro payment URL
  if (USE_MOCKS) {
    const mockPaymentData = {
      paymentId: `TY-${Date.now()}`,
      redirectUrl: `https://tyro.com/payment-page?sessionId=MOCK-${Date.now()}&amount=${bookingData.depositAmount * 100}`,
      status: 'INITIATED'
    };
    
    // Save the mock response
    saveMockResponse('TyroPaymentInitiate', bookingData, mockPaymentData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    return mockPaymentData;
  }
  
  // In production, we would make an actual API call to Tyro to initialize a payment session
  try {
    // This is a placeholder for the actual Tyro API call
    // You would need to replace this with the actual Tyro API integration
    const response = await axios.post(
      'https://api.tyro.com/payment-sessions', // Replace with actual Tyro API endpoint
      {
        amount: bookingData.depositAmount * 100, // Convert to cents
        currency: 'AUD',
        description: `Deposit for ${bookingData.tour.name}`,
        orderReference: `TIA-${Date.now().toString().slice(-6)}`,
        redirectUrl: `${process.env.APP_URL || 'http://localhost:3000'}/payment/callback`,
        cancelUrl: `${process.env.APP_URL || 'http://localhost:3000'}/payment/cancel`,
        customerDetails: {
          firstName: bookingData.customerDetails.firstName,
          lastName: bookingData.customerDetails.lastName,
          email: bookingData.customerDetails.email,
          phone: bookingData.customerDetails.phone
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TYRO_API_KEY || 'test_api_key'}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Tyro Payment API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Function to verify Tyro payment status
async function verifyPaymentStatus(paymentId) {
  // For mock mode, return a successful payment status
  if (USE_MOCKS) {
    const mockStatusData = {
      paymentId,
      status: 'COMPLETED',
      reference: `TIA${Date.now().toString().slice(-6)}`
    };
    
    // Save the mock response
    saveMockResponse('TyroPaymentVerify', paymentId, mockStatusData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    return mockStatusData;
  }
  
  // In production, we would make an actual API call to Tyro to check payment status
  try {
    // This is a placeholder for the actual Tyro API call
    const response = await axios.get(
      `https://api.tyro.com/payment-sessions/${paymentId}`, // Replace with actual Tyro API endpoint
      {
        headers: {
          'Authorization': `Bearer ${process.env.TYRO_API_KEY || 'test_api_key'}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Tyro Payment Status API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Create some sample mock data for development
function createSampleMockData() {
  if (!USE_MOCKS) return;
  
  // Sample mock response for GetServiceButtonDetails
  const sampleButtonResponse = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
    <GetServiceButtonDetailsResponse>
      <ButtonName>Group Tours</ButtonName>
      <Description>Group Tours and Activities</Description>
      <ButtonText>Group Tours</ButtonText>
      <ButtonType>Tours</ButtonType>
      <Status>OK</Status>
    </GetServiceButtonDetailsResponse>
  </Response>`;
  
  saveMockResponse('GetServiceButtonDetails', 'Sample request', sampleButtonResponse);
  
  // Sample mock response for Tyro payment
  const samplePaymentResponse = {
    paymentId: 'TY-12345678',
    redirectUrl: 'https://tyro.com/payment-page?sessionId=MOCK-12345678&amount=50000',
    status: 'INITIATED'
  };
  
  saveMockResponse('TyroPaymentInitiate', 'Sample payment request', samplePaymentResponse);
  
  // Sample mock response for Tyro payment verification
  const sampleVerifyResponse = {
    paymentId: 'TY-12345678',
    status: 'COMPLETED',
    reference: 'TIA123456'
  };
  
  saveMockResponse('TyroPaymentVerify', 'TY-12345678', sampleVerifyResponse);
  
  console.log('Created sample mock data');
}

// Create sample mock data if none exists
if (USE_MOCKS && !fs.existsSync(path.join(mockDir, 'GetServiceButtonDetails.json'))) {
  createSampleMockData();
}

module.exports = {
  getServiceButtonDetails,
  initiatePayment,
  verifyPaymentStatus,
  // Add other API functions as needed
};
