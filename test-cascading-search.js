/**
 * Test the new cascading Country -> Destination search functionality
 */

const { getAvailableCountries, getAvailableDestinations, getTourPlanDestinationName } = require('./lib/destination-mapping.ts');

console.log('🧪 TESTING CASCADING SEARCH FUNCTIONALITY');
console.log('=' .repeat(60));

// Test Cruise mapping
console.log('\n🚢 TESTING CRUISE MAPPINGS:');
const cruiseCountries = getAvailableCountries('Cruises');
console.log('Available countries for Cruises:', cruiseCountries);

cruiseCountries.forEach(country => {
  const destinations = getAvailableDestinations('Cruises', country.value);
  console.log(`\n${country.label} destinations:`, destinations);
  
  destinations.forEach(dest => {
    const tourPlanName = getTourPlanDestinationName('Cruises', country.value, dest.value);
    console.log(`  - ${dest.label} → TourPlan API: "${tourPlanName}"`);
  });
});

// Test Rail mapping  
console.log('\n\n🚂 TESTING RAIL MAPPINGS:');
const railCountries = getAvailableCountries('Rail');
console.log('Available countries for Rail:', railCountries);

railCountries.forEach(country => {
  const destinations = getAvailableDestinations('Rail', country.value);
  console.log(`\n${country.label} destinations:`, destinations);
  
  destinations.forEach(dest => {
    const tourPlanName = getTourPlanDestinationName('Rail', country.value, dest.value);
    console.log(`  - ${dest.label} → TourPlan API: "${tourPlanName}"`);
  });
});

// Test Group Tours mapping
console.log('\n\n🦁 TESTING GROUP TOURS MAPPINGS:');
const groupToursCountries = getAvailableCountries('Group Tours');
console.log('Available countries for Group Tours:', groupToursCountries);

groupToursCountries.forEach(country => {
  const destinations = getAvailableDestinations('Group Tours', country.value);
  console.log(`\n${country.label} destinations:`, destinations);
  
  destinations.forEach(dest => {
    const tourPlanName = getTourPlanDestinationName('Group Tours', country.value, dest.value);
    console.log(`  - ${dest.label} → TourPlan API: "${tourPlanName}"`);
  });
});

console.log('\n✅ CASCADING SEARCH TEST COMPLETE');