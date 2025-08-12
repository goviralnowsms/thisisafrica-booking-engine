#!/usr/bin/env node

// Test product details pages to see what dates they show as available

const railProducts = [
  // Working Rail
  { code: 'VFARLROV001VFPRDX', name: 'Victoria Falls to Pretoria', expectedDates: 'No specific dates on WordPress' },
  { code: 'VFARLROV001VFPRRY', name: 'Victoria Falls to Pretoria return', expectedDates: 'No specific dates on WordPress' },
  { code: 'VFARLROV001VFPYPM', name: 'Victoria Falls route', expectedDates: 'No specific dates on WordPress' },
  
  // Non-working Rail  
  { code: 'CPTRLROV001CTPPUL', name: 'Cape Town to Pretoria Pullman', expectedDates: 'Mon 6 Oct, Fri 10 Oct, Mon 27 Oct, Tue 28 Oct 2025' },
  { code: 'CPTRLROV001CTPRRO', name: 'Cape Town to Pretoria', expectedDates: 'Mon 3 Nov, Mon 10 Nov, Tue 9 Dec 2025' },
  { code: 'CPTRLROV001RRCTPR', name: 'Return Cape Town to Pretoria', expectedDates: 'Mon 6 Oct, Fri 10 Oct, Mon 27 Oct, Tue 28 Oct 2025' },
  { code: 'PRYRLROV001PRCPPM', name: 'Pretoria route', expectedDates: 'Fri 3 Oct, Tue 7 Oct, Fri 24 Oct, Fri 31 Oct 2025' },
];

const cruiseProducts = [
  // Working Cruise
  { code: 'BBKCRCHO018TIACP2', name: 'Chobe Princess 2 night', expectedDates: 'Mon/Wed departures' },
  { code: 'BBKCRCHO018TIACP3', name: 'Chobe Princess 3 night', expectedDates: 'Mon/Wed departures' },
  { code: 'BBKCRTVT001ZAM3NM', name: 'Zambezi Queen 3 night NM', expectedDates: 'Fridays: Aug 15 - Nov 28, 2025' },
  
  // Non-working Cruise
  { code: 'BBKCRTVT001ZAM3NS', name: 'Zambezi Queen 3 night NS', expectedDates: 'Fridays: Sep-Oct 2025' },
  { code: 'BBKCRCHO018TIACP4', name: 'Chobe Princess 4 night', expectedDates: 'Unknown - need to check' },
];

async function getProductDetails(productCode) {
  try {
    const response = await fetch(`http://localhost:3007/api/tourplan/product/${productCode}`);
    
    if (!response.ok) {
      return { 
        code: productCode, 
        error: `HTTP ${response.status}`,
        dates: null,
        rates: null
      };
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return { 
        code: productCode, 
        error: 'No data returned',
        dates: null,
        rates: null
      };
    }
    
    const product = result.data;
    
    // Extract date information
    let dateInfo = {
      fromRates: [],
      fromDateRanges: [],
      fromAvailability: []
    };
    
    // Check rates for date information
    if (product.rates && Array.isArray(product.rates)) {
      product.rates.forEach(rate => {
        if (rate.dateRange) {
          dateInfo.fromRates.push(rate.dateRange);
        }
        if (rate.dateFrom && rate.dateTo) {
          dateInfo.fromRates.push(`${rate.dateFrom} to ${rate.dateTo}`);
        }
      });
    }
    
    // Check dateRanges if it exists
    if (product.dateRanges && Array.isArray(product.dateRanges)) {
      product.dateRanges.forEach(range => {
        if (range.dateFrom && range.dateTo) {
          dateInfo.fromDateRanges.push(`${range.dateFrom} to ${range.dateTo}`);
        }
      });
    }
    
    // Check availability if it exists
    if (product.availability && Array.isArray(product.availability)) {
      dateInfo.fromAvailability = product.availability.map(a => a.date || 'Unknown date');
    }
    
    return {
      code: productCode,
      name: product.name || 'Unknown',
      supplier: product.supplierName || product.supplier,
      dates: dateInfo,
      rates: product.rates ? product.rates.length : 0,
      currency: product.rates?.[0]?.currency || 'Unknown',
      firstRate: product.rates?.[0],
      error: null
    };
    
  } catch (error) {
    return { 
      code: productCode, 
      error: error.message,
      dates: null,
      rates: null
    };
  }
}

async function testAllProductDates() {
  console.log('🔍 Testing Product Details Pages for Date Information');
  console.log('=' .repeat(80));
  
  // Test Rail Products
  console.log('\n🚂 RAIL PRODUCTS:');
  console.log('-'.repeat(80));
  
  for (const product of railProducts) {
    console.log(`\n📍 ${product.code} (${product.name})`);
    console.log(`   Expected: ${product.expectedDates}`);
    
    const details = await getProductDetails(product.code);
    
    if (details.error) {
      console.log(`   ❌ ERROR: ${details.error}`);
    } else {
      console.log(`   Product Name: ${details.name}`);
      console.log(`   Supplier: ${details.supplier}`);
      
      if (details.dates.fromRates.length > 0) {
        console.log(`   ✅ Dates from rates: ${details.dates.fromRates.join(', ')}`);
      }
      
      if (details.dates.fromDateRanges.length > 0) {
        console.log(`   ✅ Date ranges: ${details.dates.fromDateRanges.join(', ')}`);
      }
      
      if (details.dates.fromAvailability.length > 0) {
        console.log(`   ✅ Available dates: ${details.dates.fromAvailability.slice(0, 5).join(', ')}${details.dates.fromAvailability.length > 5 ? '...' : ''}`);
      }
      
      if (details.dates.fromRates.length === 0 && 
          details.dates.fromDateRanges.length === 0 && 
          details.dates.fromAvailability.length === 0) {
        console.log(`   ⚠️ NO DATE INFORMATION FOUND`);
      }
      
      if (details.firstRate) {
        const price = details.firstRate.twinRate || details.firstRate.doubleRate || details.firstRate.singleRate;
        console.log(`   💰 First rate: ${details.currency} ${price} (${details.rates} total rates)`);
      }
    }
    
    // Wait to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Test Cruise Products  
  console.log('\n\n🚢 CRUISE PRODUCTS:');
  console.log('-'.repeat(80));
  
  for (const product of cruiseProducts) {
    console.log(`\n📍 ${product.code} (${product.name})`);
    console.log(`   Expected: ${product.expectedDates}`);
    
    const details = await getProductDetails(product.code);
    
    if (details.error) {
      console.log(`   ❌ ERROR: ${details.error}`);
    } else {
      console.log(`   Product Name: ${details.name}`);
      console.log(`   Supplier: ${details.supplier}`);
      
      if (details.dates.fromRates.length > 0) {
        console.log(`   ✅ Dates from rates: ${details.dates.fromRates.join(', ')}`);
      }
      
      if (details.dates.fromDateRanges.length > 0) {
        console.log(`   ✅ Date ranges: ${details.dates.fromDateRanges.join(', ')}`);
      }
      
      if (details.dates.fromAvailability.length > 0) {
        console.log(`   ✅ Available dates: ${details.dates.fromAvailability.slice(0, 5).join(', ')}${details.dates.fromAvailability.length > 5 ? '...' : ''}`);
      }
      
      if (details.dates.fromRates.length === 0 && 
          details.dates.fromDateRanges.length === 0 && 
          details.dates.fromAvailability.length === 0) {
        console.log(`   ⚠️ NO DATE INFORMATION FOUND`);
      }
      
      if (details.firstRate) {
        const price = details.firstRate.twinRate || details.firstRate.doubleRate || details.firstRate.singleRate;
        console.log(`   💰 First rate: ${details.currency} ${price} (${details.rates} total rates)`);
      }
    }
    
    // Wait to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log('\nIf dates are missing or incorrect on the product pages, we may need to:');
  console.log('1. Add specific date availability API calls');
  console.log('2. Parse date information from product notes/descriptions');
  console.log('3. Create a hardcoded date mapping for products without API dates');
}

// Run the test
testAllProductDates().catch(console.error);