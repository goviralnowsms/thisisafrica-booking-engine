import { createClient } from '@sanity/client'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

const TOURPLAN_API_URL = 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'
const TOURPLAN_CREDENTIALS = {
  agentId: 'SAMAGT',
  password: 'S@MAgt01'
}

interface AccommodationProduct {
  code: string
  name: string
  supplier: string
  description: string
  locality: string
  roomType?: string
}

// Function to fetch accommodation from TourPlan
async function fetchAccommodationFromTourPlan(): Promise<AccommodationProduct[]> {
  console.log('📡 Fetching accommodation from TourPlan API...\n')
  
  const accommodations: AccommodationProduct[] = []
  const destinations = ['South Africa', 'Kenya', 'Tanzania', 'Zimbabwe', 'Botswana', 'Namibia']
  
  for (const destination of destinations) {
    console.log(`🔍 Searching ${destination}...`)
    
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${TOURPLAN_CREDENTIALS.agentId}</AgentID>
    <Password>${TOURPLAN_CREDENTIALS.password}</Password>
    <ButtonDestinations>
      <ButtonDestination>
        <ButtonName>Accommodation</ButtonName>
        <DestinationName>${destination}</DestinationName>
      </ButtonDestination>
    </ButtonDestinations>
    <Info>G</Info>
    <DateFrom>2026-07-15</DateFrom>
    <DateTo>2026-07-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

    try {
      const response = await fetch(TOURPLAN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          'User-Agent': 'ThisIsAfrica/1.0'
        },
        body: xml
      })

      if (!response.ok) {
        console.log(`  ❌ Failed to fetch ${destination}: ${response.status}`)
        continue
      }

      const xmlResponse = await response.text()
      
      // Parse accommodations from XML response
      const optionMatches = xmlResponse.matchAll(/<Option>[\s\S]*?<\/Option>/g)
      let count = 0
      
      for (const match of optionMatches) {
        const optionXml = match[0]
        
        // Extract product details
        const codeMatch = optionXml.match(/<Opt>([^<]+)<\/Opt>/)
        const supplierMatch = optionXml.match(/<SupplierName>([^<]+)<\/SupplierName>/)
        const descMatch = optionXml.match(/<Description>([^<]*)<\/Description>/)
        const localityMatch = optionXml.match(/<LocalityDescription>([^<]*)<\/LocalityDescription>/)
        const commentMatch = optionXml.match(/<Comment>([^<]*)<\/Comment>/)
        
        if (codeMatch && supplierMatch) {
          const code = codeMatch[1]
          const supplier = supplierMatch[1]
          const description = descMatch ? descMatch[1] : ''
          const locality = localityMatch ? localityMatch[1] : destination
          const comment = commentMatch ? commentMatch[1] : ''
          
          // Extract room type from code or description
          let roomType = 'Standard'
          const codeSuffix = code.slice(-2).toUpperCase()
          
          if (codeSuffix === 'ST' || code.toUpperCase().endsWith('STD')) roomType = 'Standard Room'
          else if (codeSuffix === 'EX' || codeSuffix === 'EXE') roomType = 'Executive Suite'
          else if (codeSuffix === 'FM' || codeSuffix === 'FAM') roomType = 'Family Suite'
          else if (codeSuffix === 'DL' || codeSuffix === 'DLX') roomType = 'Deluxe Room'
          else if (codeSuffix === 'SU' || codeSuffix === 'SUI') roomType = 'Suite'
          else if (codeSuffix === 'LX' || codeSuffix === 'LUX') roomType = 'Luxury Room'
          else if (codeSuffix === 'VL' || codeSuffix === 'VIL') roomType = 'Villa'
          else if (codeSuffix === 'SP' || codeSuffix === 'SUP') roomType = 'Superior Room'
          else if (description.toLowerCase().includes('executive')) roomType = 'Executive Suite'
          else if (description.toLowerCase().includes('family')) roomType = 'Family Suite'
          else if (description.toLowerCase().includes('deluxe')) roomType = 'Deluxe Room'
          else if (description.toLowerCase().includes('luxury')) roomType = 'Luxury Room'
          else if (description.toLowerCase().includes('suite')) roomType = 'Suite'
          else if (description.toLowerCase().includes('villa')) roomType = 'Villa'
          else if (description.toLowerCase().includes('superior')) roomType = 'Superior Room'
          
          accommodations.push({
            code,
            name: supplier,
            supplier,
            description: `${description} ${comment}`.trim() || `${supplier} - ${roomType}`,
            locality,
            roomType
          })
          count++
        }
      }
      
      console.log(`  ✅ Found ${count} accommodations in ${destination}`)
      
    } catch (error) {
      console.log(`  ❌ Error fetching ${destination}:`, error)
    }
  }
  
  // Group by hotel (unique supplier names)
  const hotelMap = new Map<string, AccommodationProduct>()
  
  for (const acc of accommodations) {
    const hotelName = acc.supplier
    
    // Keep the first occurrence of each hotel (usually the standard room)
    if (!hotelMap.has(hotelName)) {
      hotelMap.set(hotelName, {
        ...acc,
        name: hotelName,
        description: `${hotelName} - ${acc.locality}`
      })
    }
  }
  
  const uniqueHotels = Array.from(hotelMap.values())
  console.log(`\n📊 Total unique hotels found: ${uniqueHotels.length}`)
  
  return uniqueHotels
}

// Function to add accommodation to Sanity
async function addAccommodationToSanity(accommodations: AccommodationProduct[]) {
  console.log('\n📝 Adding accommodation to Sanity...\n')
  
  let created = 0
  let updated = 0
  let errors = 0
  
  for (const acc of accommodations) {
    try {
      // Check if product already exists
      const existingDoc = await sanityClient.fetch(
        `*[_type == "productImage" && productCode == $code][0]`,
        { code: acc.code }
      )
      
      const doc = {
        _type: 'productImage',
        productCode: acc.code,
        productName: acc.name,
        productType: 'accommodation',
        active: true,
        tags: [
          { _type: 'tag', value: 'accommodation' },
          { _type: 'tag', value: acc.locality.toLowerCase() }
        ],
        notes: `Hotel: ${acc.supplier}\nLocality: ${acc.locality}\nRoom Type: ${acc.roomType || 'Various'}\nAuto-imported from TourPlan`
      }
      
      if (existingDoc) {
        // Update existing document (but don't overwrite images if they exist)
        await sanityClient
          .patch(existingDoc._id)
          .set({
            productName: acc.name,
            productType: 'accommodation',
            active: true,
            notes: doc.notes
          })
          .commit()
        
        console.log(`✅ Updated: ${acc.name} (${acc.code})`)
        updated++
      } else {
        // Create new document
        await sanityClient.create(doc)
        console.log(`✅ Created: ${acc.name} (${acc.code})`)
        created++
      }
      
    } catch (error) {
      console.log(`❌ Error with ${acc.name}:`, error)
      errors++
    }
  }
  
  console.log('\n📊 Summary:')
  console.log(`  Created: ${created}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Total processed: ${accommodations.length}`)
}

// Main execution
async function main() {
  console.log('🚀 Starting accommodation import to Sanity\n')
  
  // Check for Sanity credentials
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing Sanity credentials. Please set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local')
    process.exit(1)
  }
  
  try {
    // Fetch accommodation from TourPlan
    const accommodations = await fetchAccommodationFromTourPlan()
    
    if (accommodations.length === 0) {
      console.log('⚠️  No accommodations found')
      return
    }
    
    // Show sample of what will be imported
    console.log('\n📋 Sample of accommodations to import:')
    accommodations.slice(0, 5).forEach(acc => {
      console.log(`  - ${acc.name} (${acc.code}) - ${acc.locality}`)
    })
    
    // Add to Sanity
    await addAccommodationToSanity(accommodations)
    
    console.log('\n✨ Import complete!')
    console.log('\n🎨 Next steps:')
    console.log('1. Go to your Sanity Studio')
    console.log('2. Navigate to Product Images')
    console.log('3. Filter by Product Type: Accommodation')
    console.log('4. Upload images for each hotel')
    console.log('5. The images will automatically appear on the website')
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
main()