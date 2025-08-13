// Direct XML test for Zambezi Queen products
const { wpXmlRequest } = require('./lib/tourplan/api-client');

async function testDirectXML() {
  const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <Opt>BBKCRTVT001ZAM2NS</Opt>
    <Info>GDMA</Info>
    <DateFrom>2025-08-12</DateFrom>
    <DateTo>2025-09-12</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

  console.log('🚢 Testing BBKCRTVT001ZAM2NS (2-night standard)...');
  
  try {
    const response = await wpXmlRequest(xml);
    
    // Check for AppliesDaysOfWeek
    if (response?.Reply?.OptionInfoReply?.Option) {
      const option = response.Reply.OptionInfoReply.Option;
      
      if (option.OptDateRanges?.OptDateRange) {
        const ranges = Array.isArray(option.OptDateRanges.OptDateRange) 
          ? option.OptDateRanges.OptDateRange 
          : [option.OptDateRanges.OptDateRange];
          
        ranges.forEach((range, i) => {
          console.log(`\nDate range ${i + 1}: ${range.DateFrom} to ${range.DateTo}`);
          
          if (range.RateSets?.RateSet) {
            const rateSets = Array.isArray(range.RateSets.RateSet)
              ? range.RateSets.RateSet
              : [range.RateSets.RateSet];
              
            rateSets.forEach((rateSet, j) => {
              if (rateSet.AppliesDaysOfWeek) {
                const days = Object.keys(rateSet.AppliesDaysOfWeek)
                  .filter(key => rateSet.AppliesDaysOfWeek[key] === 'Y')
                  .join(', ');
                console.log(`  Rate ${j + 1} - Days: ${days || 'None specified'}`);
              } else {
                console.log(`  Rate ${j + 1} - No AppliesDaysOfWeek found (all days available)`);
              }
            });
          }
        });
      }
      
      // Also check OptAvail
      if (option.OptAvail) {
        const availCodes = option.OptAvail.split(' ');
        console.log(`\nOptAvail codes: ${availCodes.length} days`);
        // Show first 7 days to see pattern
        console.log('First week:', availCodes.slice(0, 7).join(' '));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDirectXML();