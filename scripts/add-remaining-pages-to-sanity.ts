// Script to add remaining website pages to Sanity CMS
// Run with: npx tsx scripts/add-remaining-pages-to-sanity.ts

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

// Define additional pages that exist in the website
const additionalPages = [
  {
    title: 'Employment Opportunities',
    slug: { current: 'employment' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Employment Opportunities',
      subtitle: 'Join our team of Africa travel specialists.',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Work With Africa\'s Leading Travel Specialists' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'This Is Africa is always looking for passionate individuals who share our love for African travel. We offer opportunities for experienced travel consultants, tour guides, and travel industry professionals.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Current Opportunities' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'While we don\'t currently have any open positions, we welcome applications from qualified candidates. Please send your resume and cover letter to our team.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'What We Look For' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Experience in travel industry or African travel' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Excellent communication skills' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Passion for African destinations and wildlife' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Customer service excellence' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Apply Now',
        description: 'Send your application to join our team of Africa specialists.',
        showPhone: false,
        showEmail: true,
        customContactText: 'Email your resume to: careers@thisisafrica.com.au',
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: false,
      allowPrint: false,
      showLastUpdated: false,
    },
    seoSettings: {
      metaTitle: 'Careers at This Is Africa | Employment Opportunities',
      metaDescription: 'Join the This Is Africa team. Career opportunities in African travel and tourism.',
    },
  },
  {
    title: 'Contact Us',
    slug: { current: 'contact' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Contact Us',
      subtitle: 'Get in touch with our Africa travel specialists.',
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
        _type: 'contactInfo',
        title: 'Get In Touch',
        description: 'Contact us today to start planning your African adventure.',
        showPhone: true,
        showEmail: true,
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
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: false,
      allowPrint: false,
      showLastUpdated: false,
    },
    seoSettings: {
      metaTitle: 'Contact This Is Africa | African Safari Specialists',
      metaDescription: 'Contact our expert team to plan your African safari adventure. Phone, email and office hours.',
    },
  },
  {
    title: 'Customer Testimonials',
    slug: { current: 'testimonials' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'Customer Testimonials',
      subtitle: 'Read what our travelers say about their African adventures.',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'What Our Customers Say' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Over three decades, we\'ve helped thousands of travelers experience the magic of Africa. Here\'s what some of our customers have said about their journeys with This Is Africa.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'infoBox',
        style: 'info',
        title: 'Share Your Experience',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Recently returned from an African adventure with us? We\'d love to hear about your experience! Contact us to share your story.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'message-circle',
      },
      {
        _type: 'contactInfo',
        title: 'Start Your African Adventure',
        description: 'Ready to create your own unforgettable African memories?',
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
      metaTitle: 'Customer Reviews | This Is Africa Safari Testimonials',
      metaDescription: 'Read testimonials and reviews from customers who have traveled to Africa with This Is Africa.',
    },
  },
]

async function addRemainingPagesToSanity() {
  console.log('📄 Adding remaining pages to Sanity...\n')

  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const page of additionalPages) {
    try {
      // Check if page already exists
      const existingDoc = await client.fetch(
        `*[_type == "staticPage" && slug.current == $slug][0]`,
        { slug: page.slug.current }
      )

      if (existingDoc) {
        console.log(`⏭️  Skipping "${page.title}" - already exists`)
        skippedCount++
        continue
      }

      // Create new document
      const doc = {
        _type: 'staticPage',
        ...page,
      }

      const result = await client.create(doc)
      console.log(`✅ Added "${page.title}" (${page.slug.current})`)
      successCount++

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`❌ Error adding "${page.title}":`, error)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`✅ Successfully added: ${successCount}`)
  console.log(`⏭️  Skipped (already exist): ${skippedCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📋 Total processed: ${additionalPages.length}`)

  console.log('\n🎉 All static pages are now in Sanity!')
  console.log('\n💡 You can now:')
  console.log('1. Edit content in Sanity Studio')
  console.log('2. Add hero images to pages')
  console.log('3. Customize content for your brand')
  console.log('4. Add more FAQ items as needed')
  console.log('5. Update contact information')
}

// Run the script
addRemainingPagesToSanity()
  .then(() => {
    console.log('\n✨ All pages added successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })