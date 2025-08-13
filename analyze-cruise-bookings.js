// Analyze Chobe Princess booking patterns
const fs = require('fs');
const path = require('path');

const bookingDir = 'tourplan-logs/booking-attempts';
const productCode = 'BBKCRCHO018TIACP3';

// Find all request files for this product
const files = fs.readdirSync(bookingDir)
  .filter(f => f.includes('cruise-booking-request') && f.endsWith('.xml'));

const results = [];

files.forEach(reqFile => {
  const reqContent = fs.readFileSync(path.join(bookingDir, reqFile), 'utf8');
  
  if (!reqContent.includes(productCode)) return;
  
  // Extract date from request
  const dateMatch = reqContent.match(/<DateFrom>(\d{4}-\d{2}-\d{2})<\/DateFrom>/);
  if (!dateMatch) return;
  
  const bookingDate = dateMatch[1];
  const dayOfWeek = new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long' });
  
  // Find corresponding response file (may have 1-2 second timestamp difference)
  const timestamp = reqFile.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2})-(\d{2})/);
  let respPath = null;
  
  if (timestamp) {
    const baseTime = timestamp[1];
    const seconds = parseInt(timestamp[2]);
    
    // Try exact match first
    let respFile = reqFile.replace('request', 'response');
    respPath = path.join(bookingDir, respFile);
    
    // If not found, try +1 or +2 seconds
    if (!fs.existsSync(respPath)) {
      const nextSec = String(seconds + 1).padStart(2, '0');
      respFile = `cruise-booking-response-${baseTime}-${nextSec}.xml`;
      respPath = path.join(bookingDir, respFile);
    }
    
    if (!fs.existsSync(respPath)) {
      const nextSec = String(seconds + 2).padStart(2, '0');
      respFile = `cruise-booking-response-${baseTime}-${nextSec}.xml`;
      respPath = path.join(bookingDir, respFile);
    }
  }
  
  let status = 'UNKNOWN';
  let reference = null;
  
  if (respPath && fs.existsSync(respPath)) {
    const respContent = fs.readFileSync(respPath, 'utf8');
    
    try {
      // Parse as JSON
      const respJson = JSON.parse(respContent);
      
      if (respJson.Reply && respJson.Reply.AddServiceReply) {
        const reply = respJson.Reply.AddServiceReply;
        status = reply.Status || 'UNKNOWN';
        reference = reply.Ref || null;
      }
    } catch (e) {
      // Try XML patterns if JSON fails
      const refMatch = respContent.match(/<Ref>([^<]+)<\/Ref>/);
      if (refMatch) reference = refMatch[1];
      
      const statusMatch = respContent.match(/<Status>([^<]+)<\/Status>/);
      if (statusMatch) status = statusMatch[1];
    }
  }
  
  results.push({
    date: bookingDate,
    dayOfWeek,
    status,
    reference,
    file: reqFile
  });
});

// Sort by date
results.sort((a, b) => a.date.localeCompare(b.date));

console.log('🚢 CHOBE PRINCESS 3-NIGHT BOOKING ANALYSIS');
console.log('==========================================');
console.log(`Product: ${productCode}`);
console.log(`Total attempts: ${results.length}\n`);

// Group by status
const byStatus = {};
results.forEach(r => {
  if (!byStatus[r.status]) byStatus[r.status] = [];
  byStatus[r.status].push(r);
});

console.log('📊 Results by Status:');
Object.entries(byStatus).forEach(([status, bookings]) => {
  console.log(`\n${status}: ${bookings.length} bookings`);
  bookings.forEach(b => {
    console.log(`  ${b.date} (${b.dayOfWeek}) - ${b.reference || 'No reference'}`);
  });
});

// Analyze day patterns for successful bookings
console.log('\n📅 Day Analysis for Successful Bookings (RQ or OK):');
const successfulBookings = results.filter(r => r.status === 'RQ' || r.status === 'OK');
const dayCount = {};
successfulBookings.forEach(b => {
  dayCount[b.dayOfWeek] = (dayCount[b.dayOfWeek] || 0) + 1;
});

Object.entries(dayCount).forEach(([day, count]) => {
  console.log(`  ${day}: ${count} successful bookings`);
});

// Analyze day patterns for failed bookings
console.log('\n❌ Day Analysis for Failed Bookings (NO):');
const failedBookings = results.filter(r => r.status === 'NO');
const failDayCount = {};
failedBookings.forEach(b => {
  failDayCount[b.dayOfWeek] = (failDayCount[b.dayOfWeek] || 0) + 1;
});

Object.entries(failDayCount).forEach(([day, count]) => {
  console.log(`  ${day}: ${count} failed bookings`);
});

console.log('\n🎯 KEY FINDING:');
if (successfulBookings.length > 0 && failedBookings.length > 0) {
  const successDays = [...new Set(successfulBookings.map(b => b.dayOfWeek))];
  const failDays = [...new Set(failedBookings.map(b => b.dayOfWeek))];
  
  console.log(`Successful days: ${successDays.join(', ')}`);
  console.log(`Failed days: ${failDays.join(', ')}`);
  
  // Check for overlap
  const overlap = successDays.filter(d => failDays.includes(d));
  if (overlap.length > 0) {
    console.log(`\n⚠️ IMPORTANT: Same day sometimes works, sometimes fails: ${overlap.join(', ')}`);
    console.log('This suggests the issue is NOT just day-of-week, but also:');
    console.log('- Specific date availability/inventory');
    console.log('- Booking lead time requirements');
    console.log('- Rate validity periods');
  }
}