// Script to update Contact page in Sanity with actual content
// Run with: npx tsx scripts/update-contact-page.ts

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

const contactPageContent = {
  title: 'Contact Us',
  slug: { current: 'contact' },
  pageType: 'other',
  headerSection: {
    showHeader: true,
    headerStyle: 'simple',
    headline: 'Get a Quote',
    subtitle: 'Tell us about your dream African adventure',
  },
  content: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Speak to Our Travel Experts' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our team of Africa specialists is here to help you plan the perfect African adventure. With over 30 years of experience, we can create tailor-made itineraries for safaris, cultural tours, and unique experiences across Africa.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Contact Information' }],
      markDefs: [],
    },
    {
      _type: 'table',
      title: 'How to Reach Us',
      headers: ['Contact Method', 'Details'],
      rows: [
        { 
          cells: [
            'Phone', 
            '+61 2 9664 9187\nMon-Fri: 9:00am-5:00pm AEST\nSaturday: By appointment only'
          ] 
        },
        { 
          cells: [
            'Email', 
            'sales@thisisafrica.com.au\nWe respond within 24 hours Mon-Fri'
          ] 
        },
        { 
          cells: [
            'Office Address', 
            '51 Frenchmans Rd\nRandwick NSW 2031\nAustralia'
          ] 
        },
      ],
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Why Get a Quote?',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: '• Personalized itinerary recommendations\n' },
            { _type: 'span', text: '• Best available pricing and deals\n' },
            { _type: 'span', text: '• Expert advice from Africa specialists\n' },
            { _type: 'span', text: '• Flexible payment options' },
          ],
          markDefs: [],
        },
      ],
      icon: 'info',
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Office Hours' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Monday to Friday: 9:00 AM - 5:00 PM AEST' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Saturday: By appointment only' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: 'Sunday: Closed' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'What Happens After You Contact Us?' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Our team will review your requirements' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• We\'ll check availability for your preferred dates' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• You\'ll receive a detailed quote within 24 hours' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• We\'ll follow up to discuss your perfect African adventure' },
      ],
      markDefs: [],
    },
    {
      _type: 'contactInfo',
      title: 'Ready to Start Planning?',
      description: 'Contact our expert team today to begin planning your African adventure.',
      showPhone: true,
      showEmail: true,
    },
  ],
  pageSettings: {
    showBreadcrumbs: true,
    showTableOfContents: false,
    allowPrint: false,
    showLastUpdated: false,
  },
  seoSettings: {
    metaTitle: 'Contact This Is Africa | African Safari Specialists',
    metaDescription: 'Contact our expert team to plan your African safari adventure. Phone: +61 2 9664 9187, Email: sales@thisisafrica.com.au. Located in Sydney, Australia.',
  },
}

async function updateContactPage() {
  console.log('📄 Updating Contact page in Sanity...\n')

  try {
    // Check if page exists
    const existingDoc = await client.fetch(
      `*[_type == "staticPage" && slug.current == $slug][0]`,
      { slug: contactPageContent.slug.current }
    )

    if (existingDoc) {
      // Update existing document
      const result = await client
        .patch(existingDoc._id)
        .set(contactPageContent)
        .commit()
      console.log(`✅ Updated "${contactPageContent.title}" page with actual content`)
    } else {
      // Create new document
      const doc = {
        _type: 'staticPage',
        ...contactPageContent,
      }
      const result = await client.create(doc)
      console.log(`✅ Created "${contactPageContent.title}" page with actual content`)
    }

    console.log('\n💡 Content includes:')
    console.log('   - Contact form functionality (handled by Next.js page)')
    console.log('   - Phone: +61 2 9664 9187')
    console.log('   - Email: sales@thisisafrica.com.au')
    console.log('   - Office: 51 Frenchmans Rd, Randwick NSW 2031')
    console.log('   - Office hours and response times')
  } catch (error) {
    console.error(`❌ Error updating Contact page:`, error)
  }
}

// Run the script
updateContactPage()
  .then(() => {
    console.log('\n✨ Contact page updated successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })