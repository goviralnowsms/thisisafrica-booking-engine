// Simple test to check what's being returned
const fetch = require('node-fetch');

async function testSearch() {
  try {
    const response = await fetch('http://localhost:3008/api/tourplan/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Deluxe'
      })
    });
    
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    console.log('Response text (first 500 chars):', text.substring(0, 500));
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', {
        success: json.success,
        productsLength: json.products?.length,
        totalResults: json.totalResults,
        error: json.error
      });
    } catch (e) {
      console.log('Not valid JSON');
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testSearch();