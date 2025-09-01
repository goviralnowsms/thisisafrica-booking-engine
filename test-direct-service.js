// Test the service directly without going through the API route
const { searchProducts } = require('./lib/tourplan/services');

async function testDirectService() {
  console.log('Testing searchProducts directly...\n');
  
  const criteria = {
    productType: 'Group Tours',
    destination: 'Kenya',
    class: 'Deluxe'
  };
  
  console.log('Calling with:', criteria);
  
  try {
    const result = await searchProducts(criteria);
    
    console.log('\nResult structure:');
    console.log('- Type:', typeof result);
    console.log('- Keys:', Object.keys(result));
    console.log('- products:', Array.isArray(result.products) ? `Array with ${result.products.length} items` : typeof result.products);
    console.log('- totalResults:', result.totalResults);
    console.log('- error:', result.error);
    console.log('- message:', result.message);
    
    if (result.products && result.products.length > 0) {
      console.log('\nFirst product:', {
        code: result.products[0].code,
        name: result.products[0].name
      });
    }
  } catch (error) {
    console.error('Service call failed:', error);
  }
}

testDirectService();