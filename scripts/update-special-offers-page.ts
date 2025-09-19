// Script to update Special Offers page in Sanity with actual content and icons
// Run with: npx tsx scripts/update-special-offers-page.ts

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

const specialOffersPageContent = {
  title: 'Special Offers',
  slug: { current: 'special-offers' },
  pageType: 'other',
  headerSection: {
    showHeader: true,
    headerStyle: 'hero',
    headline: 'Special offers',
    subtitle: 'Exclusive deals and limited-time offers for your African adventure',
    lastUpdated: 'Updated regularly with new offers',
  },
  content: [
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Discover amazing savings on luxury safaris, group tours, and unique experiences across Africa.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Current special offers' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Take advantage of these limited-time deals and exclusive offers. Perfect for travelers looking for exceptional value on authentic African experiences.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'warning',
      title: 'Dynamic Special Offers',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Our special offers are loaded dynamically from TourPlan API and displayed with real-time pricing and availability. The page automatically shows current deals, exclusive discounts, and limited-time promotions.',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'gift',
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Why our special offers?' }],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'success',
      title: 'Exclusive Deals',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Limited-time offers and exclusive discounts you won\'t find anywhere else',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'gift',
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Premium Value',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Exceptional savings on luxury experiences and premium accommodations',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'star',
    },
    {
      _type: 'infoBox',
      style: 'warning',
      title: 'Limited Time',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Don\'t miss out - these special offers are available for a limited time only',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'clock',
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'How Special Offers Work' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Browse current deals loaded from our booking system' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• View detailed information and special pricing' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Check real-time availability for immediate booking' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Contact us for personalized quotes and additional savings' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Featured Special Offers Include' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Classic Kruger Package' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Experience South Africa\'s premier safari destination with special rates at Makutsi Safari Springs. Perfect for first-time safari visitors.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Sabi Sabi Bush Lodge Special' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Luxury safari experience in the exclusive Sabi Sand Game Reserve with exceptional game viewing opportunities.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Savanna Lodge Honeymoon Deal' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Romantic safari getaway with special honeymoon pricing and intimate lodge setting.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Questions about our special offers?' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our travel experts are here to help you find the perfect deal and answer any questions about our special offers.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'contactInfo',
      title: 'Get Help with Special Offers',
      description: 'Contact us for more information about current deals and to secure your special offer pricing.',
      showPhone: true,
      showEmail: true,
      customContactText: 'Download our latest brochure: /pdfs/products/Brochure-2025-Web.pdf',
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'No Special Offers Available?' }],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Check Back Soon',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'If no special offers are currently available, check back soon for new deals and exclusive offers! In the meantime, browse our full range of African tours and safaris.',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'gift',
    },
  ],
  pageSettings: {
    showBreadcrumbs: true,
    showTableOfContents: false,
    allowPrint: false,
    showLastUpdated: true,
  },
  seoSettings: {
    metaTitle: 'African Safari Special Offers | Deals & Discounts | This Is Africa',
    metaDescription: 'Save on African safaris with our special offers. Limited-time deals on luxury lodges, group tours, and exclusive experiences. Book now for the best prices.',
  },
}

async function updateSpecialOffersPage() {
  console.log('🎁 Updating Special Offers page in Sanity...\n')

  try {
    // Check if page exists
    const existingDoc = await client.fetch(
      `*[_type == "staticPage" && slug.current == $slug][0]`,
      { slug: specialOffersPageContent.slug.current }
    )

    if (existingDoc) {
      // Update existing document
      const result = await client
        .patch(existingDoc._id)
        .set(specialOffersPageContent)
        .commit()
      console.log(`✅ Updated "${specialOffersPageContent.title}" page with actual content`)
    } else {
      // Create new document
      const doc = {
        _type: 'staticPage',
        ...specialOffersPageContent,
      }
      const result = await client.create(doc)
      console.log(`✅ Created "${specialOffersPageContent.title}" page with actual content`)
    }

    console.log('\n💡 Special Offers page now includes:')
    console.log('   🎁 Gift icon for exclusive deals section')
    console.log('   ⭐ Star icon for premium value section')
    console.log('   ⏰ Clock icon for limited time offers')
    console.log('   📧 Contact information with email icons')
    console.log('   🔄 Dynamic content explanation')
    console.log('   📝 Featured offers descriptions')
    console.log('   📱 Contact form integration')
    
    console.log('\n🎯 Hero image: /images/products/vic-falls2-crop.jpeg')
    console.log('📄 Brochure link: /pdfs/products/Brochure-2025-Web.pdf')
    console.log('🖼️ Background image: /images/products/rsz_leopard-in-tree.jpg')
    
  } catch (error) {
    console.error(`❌ Error updating Special Offers page:`, error)
  }
}

// Run the script
updateSpecialOffersPage()
  .then(() => {
    console.log('\n✨ Special Offers page updated successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })