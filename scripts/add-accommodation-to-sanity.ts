// Script to add accommodation products to Sanity CMS
// Run with: npx tsx scripts/add-accommodation-to-sanity.ts

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Accommodation products from our API search results
const accommodationProducts = [
  // Cape Town Hotels
  { code: 'CPTACCAP001CAPLUX', name: 'The Cape Grace - Luxury Room', location: 'Cape Town' },
  { code: 'CPTACPOR002PORTST', name: 'The Portswood Hotel - Standard Room', location: 'Cape Town' },
  { code: 'CPTACPRO087BREABB', name: 'Protea Hotel Breakwater Lodge - Standard Room', location: 'Cape Town' },
  { code: 'CPTACTAB000TAAC01', name: 'The Table Bay Hotel - Executive Suite', location: 'Cape Town' },
  { code: 'CPTACTAB000TABEXS', name: 'The Table Bay Hotel - Executive Suite', location: 'Cape Town' },
  { code: 'CPTACTAB000TABLKP', name: 'The Table Bay Hotel - Luxury Twin or King Room', location: 'Cape Town' },
  
  // Safari Lodges - Kapama Game Reserve
  { code: 'GKPACKPMBUFKPMBU1', name: 'Kapama Buffalo Camp - Luxury Tent', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKARKPMKR1', name: 'Kapama Karula - Villa', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKARKPMKR2', name: 'Kapama Karula - Family Villa', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKRLKPMDX', name: 'Kapama River Lodge - Deluxe Suite', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKRLKPMRL1', name: 'Kapama River Lodge - Standard Courtyard Suite', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKRLKPMRL2', name: 'Kapama River Lodge - Royal Suite', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKRLKPMRL3', name: 'Kapama River Lodge - Spa Suite', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMKRLKPMRL4', name: 'Kapama River Lodge - Family Spa Suite', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMSTHKPMST1', name: 'Kapama Southern Camp - Suite', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMSTHKPMST2', name: 'Kapama Southern Camp - Luxury Villa', location: 'Kapama Game Reserve' },
  { code: 'GKPACKPMSTHKPMST3', name: 'Kapama Southern Camp - Family Villa', location: 'Kapama Game Reserve' },
  
  // Safari Lodges - Sabi Sabi
  { code: 'GKPACSAB019MANSUI', name: 'Sabi Sabi Bush Lodge - Mandleve Deluxe Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSAB019SABSUI', name: 'Sabi Sabi Bush Lodge - Luxury Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSAB019SABVIL', name: 'Sabi Sabi Bush Lodge - Luxury Villas', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABBLDSABBLM', name: 'Sabi Sabi Bush Lodge Direct - Mandleve Deluxe Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABBLDSABBLV', name: 'Sabi Sabi Bush Lodge Direct - Luxury Villa', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABBLDSABDLS', name: 'Sabi Sabi Bush Lodge Direct - Luxury Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABEALSABEAV', name: 'Sabi Sabi Earth Lodge Direct - Amber Villa', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABEALSABELX', name: 'Sabi Sabi Earth Lodge Direct - Luxury Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABLBDSABLBL', name: 'Sabi Sabi Little Bush Direct - Luxury Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABSCDSABSCL', name: 'Sabi Sabi Selati Camp Direct - Luxury Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABSCDSABSIV', name: 'Sabi Sabi Selati Camp Direct - Ivory Presidential Suite', location: 'Sabi Sand Game Reserve' },
  { code: 'GKPACSABSCDSABSLM', name: 'Sabi Sabi Selati Camp Direct - Lourenco Marques Honeymoon Suite', location: 'Sabi Sand Game Reserve' },
  
  // Other Safari Lodges
  { code: 'GKPACBEC002BECDEL', name: 'Becks Safari Lodge - Deluxe Suite', location: 'Karongwe Game Reserve' },
  { code: 'GKPACKUN001KUNLUX', name: 'Kuname River Lodge - Luxury Suite', location: 'Karongwe Game Reserve' },
  { code: 'GKPACKUN001KUNMAN', name: 'Kuname River Lodge - Manor House', location: 'Karongwe Game Reserve' },
  { code: 'GKPACKUN001KUNPRS', name: 'Kuname River Lodge - Premier Suite', location: 'Karongwe Game Reserve' },
  { code: 'GKPACSIM018SIMHTS', name: 'Simbavati Hilltop Lodge - Suite', location: 'Limpopo' },
  { code: 'HDSACKAR015KARFAM', name: 'Karongwe River Lodge - Family Suite', location: 'Hoedspruit' },
  { code: 'HDSACKAR015KARLUX', name: 'Karongwe River Lodge - Luxury Suite', location: 'Hoedspruit' },
  
  // Johannesburg
  { code: 'JNBACDOR005DORCLS', name: 'Peermont D\'oreale Grande (Emperors Palace) - Classic Suite', location: 'Johannesburg' },
]

async function addAccommodationToSanity() {
  console.log('🏨 Starting to add accommodation products to Sanity...')
  
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  
  for (const product of accommodationProducts) {
    try {
      // Check if product already exists
      const existingDoc = await client.fetch(
        `*[_type == "productImage" && productCode == $code][0]`,
        { code: product.code }
      )
      
      if (existingDoc) {
        console.log(`⏭️  Skipping ${product.code} - already exists`)
        skippedCount++
        continue
      }
      
      // Create new document
      const doc = {
        _type: 'productImage',
        productCode: product.code,
        productName: product.name,
        productType: 'accommodation',
        active: true,
        tags: [
          { _type: 'tag', value: 'accommodation' },
          { _type: 'tag', value: product.location.toLowerCase().replace(' ', '-') },
        ],
        notes: `Accommodation in ${product.location}. Added via script.`,
      }
      
      const result = await client.create(doc)
      console.log(`✅ Added ${product.code} - ${product.name}`)
      successCount++
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error adding ${product.code}:`, error)
      errorCount++
    }
  }
  
  console.log('\n📊 Summary:')
  console.log(`✅ Successfully added: ${successCount}`)
  console.log(`⏭️  Skipped (already exist): ${skippedCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📋 Total processed: ${accommodationProducts.length}`)
  
  console.log('\n💡 Next steps:')
  console.log('1. Go to your Sanity Studio')
  console.log('2. Navigate to Product Images')
  console.log('3. Filter by Product Type: Accommodation')
  console.log('4. Upload images for each accommodation')
}

// Run the script
addAccommodationToSanity()
  .then(() => {
    console.log('\n✨ Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })