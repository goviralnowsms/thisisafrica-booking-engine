// Script to add accommodation suppliers to Sanity
// Run with: npx tsx scripts/add-accommodation-suppliers.ts

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Sample accommodation suppliers to add
const accommodationSuppliers = [
  {
    _type: 'accommodationSupplier',
    supplierName: 'Portswood Hotel',
    supplierCode: 'PORTSWOOD',
    description: 'A historic waterfront hotel offering elegant accommodations and stunning harbour views.',
    location: {
      country: 'South Africa',
      destination: 'Cape Town',
      address: 'V&A Waterfront, Cape Town, South Africa',
    },
    type: 'hotel',
    category: 'luxury',
    associatedProductCodes: [
      'CPTHTHTM001CPG8DD',
      'CPTHTHTM001CPG8TV',
      'CPTHTHTM001CPG8SS',
      // Add more product codes for Portswood rooms
    ],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Gym', 'Concierge'],
    active: true,
    featured: true,
    sortOrder: 1,
  },
  {
    _type: 'accommodationSupplier',
    supplierName: 'Sabi Sabi Bush Lodge',
    supplierCode: 'SABISABI',
    description: 'World-renowned safari lodge in the heart of the Sabi Sand Game Reserve, offering luxury accommodation and exceptional wildlife experiences.',
    location: {
      country: 'South Africa',
      destination: 'Sabi Sand Game Reserve',
      address: 'Sabi Sand Game Reserve, Mpumalanga, South Africa',
      gps: {
        latitude: -24.788,
        longitude: 31.487,
      },
    },
    type: 'lodge',
    category: 'ultra-luxury',
    associatedProductCodes: [
      // Add Sabi Sabi product codes here
    ],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Game Drives', 'Bush Walks', 'Boma Dinners'],
    active: true,
    featured: true,
    sortOrder: 2,
  },
  {
    _type: 'accommodationSupplier',
    supplierName: 'Table Bay Hotel',
    supplierCode: 'TABLEBAY',
    description: 'Luxury hotel with spectacular views of Table Mountain and the Atlantic Ocean.',
    location: {
      country: 'South Africa',
      destination: 'Cape Town',
      address: 'Quay 6, V&A Waterfront, Cape Town',
    },
    type: 'hotel',
    category: 'luxury',
    associatedProductCodes: [
      // Add Table Bay product codes here
    ],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Gym', 'Business Center'],
    active: true,
    featured: false,
    sortOrder: 3,
  },
  {
    _type: 'accommodationSupplier',
    supplierName: 'Cape Grace Hotel',
    supplierCode: 'CAPEGRACE',
    description: 'Timeless elegance and warm hospitality in the heart of the V&A Waterfront.',
    location: {
      country: 'South Africa',
      destination: 'Cape Town',
      address: 'West Quay Road, V&A Waterfront, Cape Town',
    },
    type: 'hotel',
    category: 'luxury',
    associatedProductCodes: [
      // Add Cape Grace product codes here
    ],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Yacht', 'Whisky Bar'],
    active: true,
    featured: false,
    sortOrder: 4,
  },
  {
    _type: 'accommodationSupplier',
    supplierName: 'Kapama River Lodge',
    supplierCode: 'KAPAMA',
    description: 'Luxurious safari lodge offering Big Five game viewing in the Greater Kruger area.',
    location: {
      country: 'South Africa',
      destination: 'Hoedspruit',
      address: 'Kapama Private Game Reserve, Hoedspruit',
      gps: {
        latitude: -24.387,
        longitude: 31.036,
      },
    },
    type: 'lodge',
    category: 'luxury',
    associatedProductCodes: [
      // Add Kapama product codes here
    ],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'WiFi', 'Game Drives', 'Bush Walks', 'Spa'],
    active: true,
    featured: false,
    sortOrder: 5,
  },
  {
    _type: 'accommodationSupplier',
    supplierName: 'Savannah Lodge',
    supplierCode: 'SAVANNAH',
    description: 'Intimate luxury lodge offering personalized safari experiences.',
    location: {
      country: 'South Africa',
      destination: 'Sabi Sand Game Reserve',
      address: 'Sabi Sand Game Reserve, Mpumalanga',
    },
    type: 'lodge',
    category: 'luxury',
    associatedProductCodes: [
      // Add Savannah product codes here
    ],
    amenities: ['Pool', 'Restaurant', 'Bar', 'WiFi', 'Game Drives', 'Bush Walks', 'Spa Treatments'],
    active: true,
    featured: false,
    sortOrder: 6,
  },
]

async function addAccommodationSuppliers() {
  console.log('🏨 Adding accommodation suppliers to Sanity...')

  for (const supplier of accommodationSuppliers) {
    try {
      // Check if supplier already exists
      const existing = await client.fetch(
        `*[_type == "accommodationSupplier" && supplierName == $name][0]`,
        { name: supplier.supplierName }
      )

      if (existing) {
        console.log(`✓ Supplier already exists: ${supplier.supplierName}`)
        continue
      }

      // Create new supplier
      const result = await client.create(supplier)
      console.log(`✅ Added supplier: ${supplier.supplierName} (${result._id})`)
    } catch (error) {
      console.error(`❌ Failed to add supplier ${supplier.supplierName}:`, error)
    }
  }

  console.log('\n🏨 Accommodation suppliers setup complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Go to Sanity Studio (/studio) to add primary images for each supplier')
  console.log('2. Update the associated product codes for each supplier')
  console.log('3. The accommodation page will now automatically use these supplier images')
}

// Run the script
addAccommodationSuppliers().catch(console.error)