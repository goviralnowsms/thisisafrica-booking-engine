// Quick test to check Zambezi Queen availability patterns
async function checkZambeziAvailability() {
  const products = [
    'BBKCRTVT001ZAM2NS', // 2-night standard (works but shows all days)
    'BBKCRTVT001ZAM2NM', // 2-night master (works but shows all days)
    'BBKCRTVT001ZAM3NS'  // 3-night standard (shows Fridays but fails)
  ];
  
  for (const productCode of products) {
    console.log(`\n🚢 Checking ${productCode}...`);
    
    try {
      const response = await fetch(`http://localhost:3005/api/tourplan/product/${productCode}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Check for AppliesDaysOfWeek in the rates
        const rates = result.data.rates || [];
        console.log(`   Found ${rates.length} rate periods`);
        
        rates.forEach((rate, index) => {
          if (rate.appliesDaysOfWeek) {
            const days = Object.keys(rate.appliesDaysOfWeek)
              .filter(key => key.startsWith('@_') && rate.appliesDaysOfWeek[key] === 'Y')
              .map(key => key.replace('@_', ''));
            console.log(`   Rate period ${index + 1}: ${days.join(', ')} only`);
          } else {
            console.log(`   Rate period ${index + 1}: No day restrictions found`);
          }
        });
        
        // Also check raw response for AppliesDaysOfWeek
        const rawResponse = result.data.rawResponse;
        if (rawResponse && typeof rawResponse === 'string' && rawResponse.includes('AppliesDaysOfWeek')) {
          console.log('   ✓ AppliesDaysOfWeek found in raw XML response');
        }
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
}

checkZambeziAvailability();