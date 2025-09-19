// Script to update Accommodation page in Sanity with actual content from the website
// Run with: npx tsx scripts/update-accommodation-page.ts

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

const accommodationPageContent = {
  title: 'Accommodation',
  slug: { current: 'accommodation' },
  pageType: 'search',
  headerSection: {
    showHeader: true,
    headerStyle: 'hero',
    headline: 'African Accommodations',
    subtitle: 'From luxury safari lodges to intimate tented camps',
    description: 'Browse our handpicked collection of exceptional accommodations across Africa',
    heroImage: '/images/products/accomm-hero.jpg',
    lastUpdated: 'Updated with latest availability',
  },
  content: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Scattered throughout Africa\'s parks and reserves are world-class game lodges and permanent tented safari camps that offer unparalleled wildlife experiences combined with exceptional comfort and service.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Experience African Hospitality' }],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'success',
      title: 'Safari Lodges',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Game lodges offer accommodation ranging from hotel-like rooms to thatched-roofed chalets with private balconies, en-suite bathrooms, and luxury amenities. Many feature private plunge pools, spa centers, and viewing decks overlooking waterholes.',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'home',
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Tented Camps',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Experience the romance of classic safari in permanent canvas-sided tents with all modern comforts. These camps offer en-suite bathrooms, comfortable beds, and authentic bush experiences with communal dining and evening campfires.',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'tent',
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'All our featured properties include meals and guided activities, ensuring you experience the best of African wildlife and hospitality. Our team will help you select the perfect accommodation to match your travel style and budget.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Search Features' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Real-time availability checking through TourPlan API' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Country and destination-based filtering' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Room class selection (Standard, Suite, Luxury, Villa)' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Direct booking inquiries and quote requests' },
      ],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'warning',
      title: 'Accommodation Categories',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: '• Ultra-Luxury: Premier safari lodges with world-class amenities\n' },
            { _type: 'span', text: '• Luxury: High-end properties with exceptional service\n' },
            { _type: 'span', text: '• Standard: Comfortable accommodations with essential amenities' },
          ],
          markDefs: [],
        },
      ],
      icon: 'star',
    },
    {
      _type: 'table',
      title: 'Popular Accommodation Types',
      headers: ['Type', 'Description', 'Typical Features'],
      rows: [
        { cells: ['Safari Lodge', 'Permanent structures in game reserves', 'En-suite bathrooms, game drives, restaurant'] },
        { cells: ['Tented Camp', 'Canvas tents with solid foundations', 'Authentic safari experience, campfire dinners'] },
        { cells: ['Bush Camp', 'Remote wilderness locations', 'Walking safaris, night drives, stargazing'] },
        { cells: ['River Lodge', 'Properties along rivers and waterways', 'Boat excursions, fishing, hippo viewing'] },
        { cells: ['Tree Lodge', 'Elevated accommodations', 'Unique perspectives, bird watching, canopy walks'] },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Featured Destinations' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'South Africa' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Experience world-renowned properties in Kruger National Park, Sabi Sand Game Reserve, and the exclusive private reserves. From Sabi Sabi Bush Lodge to intimate tented camps.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Kenya & Tanzania' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Stay in the heart of the Masai Mara or Serengeti with luxury lodges and authentic tented camps perfectly positioned for the Great Migration.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Botswana' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Discover exclusive concessions in the Okavango Delta with water-based activities, mokoro excursions, and exceptional game viewing.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'contactInfo',
      title: 'Ready to Experience Africa?',
      description: 'Let our experts help you choose the perfect accommodation for your African adventure. We\'ll create a customized itinerary that matches your preferences and budget.',
      showPhone: true,
      showEmail: true,
      customContactText: 'Available for accommodation consultation and tailor-made itinerary planning.',
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Booking Process',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: '1. Search by country and destination using our real-time system\n' },
            { _type: 'span', text: '2. View detailed property information and amenities\n' },
            { _type: 'span', text: '3. Request quotes directly through our contact system\n' },
            { _type: 'span', text: '4. Speak with our experts for personalized recommendations' },
          ],
          markDefs: [],
        },
      ],
      icon: 'clipboard-check',
    },
  ],
  pageSettings: {
    showBreadcrumbs: true,
    showTableOfContents: true,
    allowPrint: false,
    showLastUpdated: true,
  },
  seoSettings: {
    metaTitle: 'African Safari Accommodation | Lodges & Camps | This Is Africa',
    metaDescription: 'Browse luxury safari lodges, tented camps and bush accommodations across Africa. Real-time availability, expert recommendations, and personalized service.',
  },
}

async function updateAccommodationPage() {
  console.log('🏨 Re-adding Accommodation page to Sanity...\n')

  try {
    // Check if page exists
    const existingDoc = await client.fetch(
      `*[_type == "staticPage" && slug.current == $slug][0]`,
      { slug: accommodationPageContent.slug.current }
    )

    if (existingDoc) {
      // Update existing document
      const result = await client
        .patch(existingDoc._id)
        .set(accommodationPageContent)
        .commit()
      console.log(`✅ Updated "${accommodationPageContent.title}" page with complete content`)
    } else {
      // Create new document
      const doc = {
        _type: 'staticPage',
        ...accommodationPageContent,
      }
      const result = await client.create(doc)
      console.log(`✅ Created "${accommodationPageContent.title}" page with complete content`)
    }

    console.log('\n💡 Accommodation page now includes:')
    console.log('   🏠 Home icon for Safari Lodges section')
    console.log('   🏕️ Tent icon for Tented Camps section')
    console.log('   ⭐ Star icon for accommodation categories')
    console.log('   📋 Clipboard icon for booking process')
    console.log('   🗂️ Comprehensive accommodation types table')
    console.log('   🌍 Featured destinations (South Africa, Kenya, Tanzania, Botswana)')
    console.log('   🔍 Search functionality documentation')
    console.log('   📞 Contact information for expert consultation')
    
    console.log('\n🎯 Hero image: /images/products/accomm-hero.jpg')
    console.log('📋 Page includes real-time TourPlan API integration details')
    console.log('🏷️ Room categories: Standard, Suite, Luxury, Villa')
    
  } catch (error) {
    console.error(`❌ Error updating Accommodation page:`, error)
  }
}

// Run the script
updateAccommodationPage()
  .then(() => {
    console.log('\n✨ Accommodation page added back successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })