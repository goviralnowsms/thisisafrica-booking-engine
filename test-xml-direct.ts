import { buildAccommodationSearchRequest } from './lib/tourplan/requests';

console.log('🏨 Testing accommodation XML request building...');

const roomConfigs = [{
  Adults: 2,
  Children: 0,
  Type: 'DB',
  Quantity: 1
}];

const xml = buildAccommodationSearchRequest('Nairobi', '', '', roomConfigs);

console.log('📝 Generated XML:');
console.log(xml);

console.log('\n🔍 Key elements to check:');
console.log('- ButtonName: Accommodation');
console.log('- Info: GS'); 
console.log('- RoomConfigs included');
console.log('- RateConvert: Y');