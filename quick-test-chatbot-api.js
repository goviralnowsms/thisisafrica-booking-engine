const http = require('http');

function testAPI() {
  console.log('🤖 Testing chatbot products API...');
  
  const options = {
    hostname: 'localhost',
    port: 3006,
    path: '/api/chatbot/products?q=safari&limit=3',
    method: 'GET',
    timeout: 10000 // 10 second timeout
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    console.log(`Status: ${res.statusCode}`);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ API Response:', {
          success: result.success,
          count: result.count,
          productsLength: result.products?.length,
          firstProduct: result.products?.[0]?.name,
          firstProductPrice: result.products?.[0]?.price,
          fallback: result.fallback
        });
        
        if (result.products?.length > 0) {
          console.log('\n📋 Products returned:');
          result.products.forEach((product, i) => {
            console.log(`${i + 1}. ${product.name} - ${product.price} (${product.code})`);
          });
        }
      } catch (err) {
        console.log('❌ JSON Parse Error:', err.message);
        console.log('Raw response:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Request Error:', err.message);
  });

  req.on('timeout', () => {
    console.log('❌ Request Timeout');
    req.destroy();
  });

  req.end();
}

testAPI();