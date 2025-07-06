// testTourplanAPI.js
const tourplanAPI = require('./tourplanAPI');

async function testAPI() {
  try {
    console.log('Testing API with mock mode enabled:');
    const result = await tourplanAPI.getServiceButtonDetails('Group Tours');
    console.log('API Response:', result);
    
    // If you want to parse the XML response, you could add xml2js or similar
    // For now, we'll just check if we got something back
    if (result && result.includes('<Response>')) {
      console.log('Test successful! Received valid XML response.');
    } else {
      console.log('Warning: Response format may not be as expected.');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
