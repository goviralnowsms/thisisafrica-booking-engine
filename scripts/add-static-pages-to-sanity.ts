// Script to add static pages to Sanity CMS
// Run with: npx tsx scripts/add-static-pages-to-sanity.ts

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

// Define the static pages to create
const staticPages = [
  {
    title: 'Terms & Conditions',
    slug: { current: 'terms-conditions' },
    pageType: 'terms',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Terms & Conditions',
      subtitle: 'Please read these terms and conditions carefully before booking with This Is Africa.',
      lastUpdated: 'Last updated: January 2025',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '1. Booking Terms' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'All bookings are subject to availability and confirmation. A deposit is required to secure your booking, with the balance due before departure. Prices are subject to change due to currency fluctuations, fuel surcharges, or other factors beyond our control.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '2. Payment Terms' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We accept major credit cards and bank transfers. All prices are quoted in Australian Dollars (AUD) unless otherwise stated. Payment must be received in full before travel documents are issued.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '3. Cancellation Policy' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Cancellation fees apply based on the time before departure. We strongly recommend travel insurance to cover cancellation costs. Specific cancellation terms vary by product and will be provided at the time of booking.',
          },
        ],
        markDefs: [],
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: true,
      allowPrint: true,
      showLastUpdated: true,
    },
    seoSettings: {
      metaTitle: 'Terms & Conditions | This Is Africa',
      metaDescription: 'Read the terms and conditions for booking African safaris and tours with This Is Africa Travel.',
    },
  },
  {
    title: 'Privacy Policy',
    slug: { current: 'privacy-policy' },
    pageType: 'privacy',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your personal information.',
      lastUpdated: 'Last updated: January 2025',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Information We Collect' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We collect personal information necessary to process your bookings and provide our services. This includes your name, contact details, passport information, and payment details.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'How We Use Your Information' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Your information is used to process bookings, communicate with you about your travel arrangements, and provide customer support. We may also send you marketing communications with your consent.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Data Security' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'We implement appropriate security measures to protect your personal information from unauthorized access, use, or disclosure. All payment information is processed securely through encrypted connections.',
          },
        ],
        markDefs: [],
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: true,
      allowPrint: true,
      showLastUpdated: true,
    },
    seoSettings: {
      metaTitle: 'Privacy Policy | This Is Africa',
      metaDescription: 'Learn about how This Is Africa Travel protects your privacy and handles your personal information.',
    },
  },
  {
    title: 'Travel Insurance',
    slug: { current: 'insurance' },
    pageType: 'travel-insurance',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'Travel Insurance',
      subtitle: 'Protect your African adventure with comprehensive travel insurance.',
      lastUpdated: 'Last updated: January 2025',
    },
    content: [
      {
        _type: 'infoBox',
        style: 'warning',
        title: 'Important Notice',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Travel insurance is mandatory for all travelers booking with This Is Africa. You must have adequate coverage before departure.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'alert-triangle',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Why Travel Insurance is Essential' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'African safaris involve remote destinations where medical facilities may be limited. Comprehensive travel insurance ensures you are covered for medical emergencies, trip cancellations, lost luggage, and emergency evacuations.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Recommended Coverage' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Your travel insurance should include:',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Medical expenses (minimum $100,000 AUD)' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Emergency evacuation and repatriation' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Trip cancellation and interruption' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Lost or delayed baggage' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Personal liability coverage' },
        ],
        markDefs: [],
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: false,
      allowPrint: true,
      showLastUpdated: true,
    },
    seoSettings: {
      metaTitle: 'Travel Insurance for African Safaris | This Is Africa',
      metaDescription: 'Essential information about travel insurance requirements for your African safari with This Is Africa.',
    },
  },
  {
    title: 'Visa Information',
    slug: { current: 'visa-information' },
    pageType: 'visa-info',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Visa Information',
      subtitle: 'Entry requirements for African destinations.',
      lastUpdated: 'Last updated: January 2025',
    },
    content: [
      {
        _type: 'infoBox',
        style: 'info',
        title: 'Check Requirements',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Visa requirements vary by nationality and destination. Always check current requirements with the relevant embassy or consulate before traveling.',
              },
            ],
            markDefs: [],
          },
        ],
        icon: 'info',
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Popular Destinations' }],
        markDefs: [],
      },
      {
        _type: 'table',
        title: 'Visa Requirements for Australian Citizens',
        headers: ['Country', 'Visa Required', 'Notes'],
        rows: [
          { cells: ['Kenya', 'Yes', 'eVisa available online'] },
          { cells: ['Tanzania', 'Yes', 'Visa on arrival or eVisa'] },
          { cells: ['South Africa', 'No', 'Up to 90 days visa-free'] },
          { cells: ['Botswana', 'No', 'Up to 90 days visa-free'] },
          { cells: ['Zimbabwe', 'Yes', 'Visa on arrival available'] },
          { cells: ['Uganda', 'Yes', 'eVisa recommended'] },
          { cells: ['Rwanda', 'Yes', 'Visa on arrival or online'] },
        ],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Passport Requirements' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Your passport must be valid for at least 6 months from your date of entry and have at least 2 blank pages for visa stamps.',
          },
        ],
        markDefs: [],
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: false,
      allowPrint: true,
      showLastUpdated: true,
    },
    seoSettings: {
      metaTitle: 'African Visa Requirements | This Is Africa',
      metaDescription: 'Visa requirements and entry information for African countries. Plan your safari with This Is Africa.',
    },
  },
  {
    title: 'Health & Safety',
    slug: { current: 'health-safety' },
    pageType: 'health-safety',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Health & Safety',
      subtitle: 'Important health and safety information for African travel.',
      lastUpdated: 'Last updated: January 2025',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Vaccinations' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Consult your doctor or travel clinic at least 6-8 weeks before departure. Common vaccinations include:',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '• Yellow Fever (required for some countries)' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '• Hepatitis A and B' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '• Typhoid' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: '• Tetanus-Diphtheria' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Malaria Prevention' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Many African destinations have malaria risk. Consult your doctor about antimalarial medication and take precautions against mosquito bites.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Safari Safety' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Always follow your guide\'s instructions. Stay in the vehicle during game drives unless told otherwise. Keep a safe distance from all wildlife.',
          },
        ],
        markDefs: [],
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: true,
      allowPrint: true,
      showLastUpdated: true,
    },
    seoSettings: {
      metaTitle: 'Health & Safety for African Travel | This Is Africa',
      metaDescription: 'Essential health and safety information for traveling to Africa. Vaccinations, malaria prevention, and safari safety tips.',
    },
  },
  {
    title: 'Frequently Asked Questions',
    slug: { current: 'faq' },
    pageType: 'faq',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Frequently Asked Questions',
      subtitle: 'Common questions about African safaris and travel.',
    },
    content: [
      {
        _type: 'accordion',
        title: 'Booking Questions',
        items: [
          {
            question: 'How far in advance should I book my safari?',
            answer: [
              {
                _type: 'block',
                style: 'normal',
                children: [
                  {
                    _type: 'span',
                    text: 'We recommend booking at least 6-12 months in advance, especially for peak season travel (July-October). This ensures the best availability and rates.',
                  },
                ],
                markDefs: [],
              },
            ],
          },
          {
            question: 'What is included in the safari price?',
            answer: [
              {
                _type: 'block',
                style: 'normal',
                children: [
                  {
                    _type: 'span',
                    text: 'Most safaris include accommodation, meals, game drives, park fees, and transfers. International flights are typically not included. Check specific tour details for exact inclusions.',
                  },
                ],
                markDefs: [],
              },
            ],
          },
          {
            question: 'Can I customize my safari itinerary?',
            answer: [
              {
                _type: 'block',
                style: 'normal',
                children: [
                  {
                    _type: 'span',
                    text: 'Yes! We specialize in tailor-made safaris. Contact us with your preferences and we\'ll create a custom itinerary to match your interests and budget.',
                  },
                ],
                markDefs: [],
              },
            ],
          },
        ],
      },
      {
        _type: 'accordion',
        title: 'Travel Preparation',
        items: [
          {
            question: 'What should I pack for a safari?',
            answer: [
              {
                _type: 'block',
                style: 'normal',
                children: [
                  {
                    _type: 'span',
                    text: 'Pack neutral-colored clothing, comfortable walking shoes, sun protection, binoculars, camera, and any personal medications. We provide a detailed packing list with your booking confirmation.',
                  },
                ],
                markDefs: [],
              },
            ],
          },
          {
            question: 'Is it safe to travel to Africa?',
            answer: [
              {
                _type: 'block',
                style: 'normal',
                children: [
                  {
                    _type: 'span',
                    text: 'Millions of tourists safely visit Africa each year. We work with reputable partners and provide comprehensive safety briefings. Follow local advice and take normal travel precautions.',
                  },
                ],
                markDefs: [],
              },
            ],
          },
        ],
      },
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: false,
      allowPrint: true,
      showLastUpdated: false,
    },
    seoSettings: {
      metaTitle: 'Safari FAQ | This Is Africa',
      metaDescription: 'Frequently asked questions about African safaris, travel preparation, and booking with This Is Africa.',
    },
  },
  {
    title: 'Tailor Made Tours',
    slug: { current: 'tailor-made' },
    pageType: 'other',
    headerSection: {
      showHeader: true,
      headerStyle: 'hero',
      headline: 'Tailor Made Tours',
      subtitle: 'Create your perfect African adventure, designed just for you.',
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Your Dream Safari, Your Way' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'With over 30 years of experience crafting bespoke African adventures, we specialize in creating tailor-made safaris that match your exact preferences, interests, and budget.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'How It Works' }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '1. Tell us your travel dreams and preferences' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '2. Our experts design a custom itinerary' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '3. We refine it together until it\'s perfect' },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: '4. Enjoy your personalized African adventure' },
        ],
        markDefs: [],
      },
      {
        _type: 'contactInfo',
        title: 'Start Planning Your Tailor Made Safari',
        description: 'Contact our expert travel consultants to begin creating your perfect African adventure.',
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
      metaTitle: 'Tailor Made African Safaris | This Is Africa',
      metaDescription: 'Create your perfect custom African safari with This Is Africa. Personalized itineraries designed by experts.',
    },
  },
]

async function addStaticPagesToSanity() {
  console.log('📄 Starting to add static pages to Sanity...\n')

  let successCount = 0
  let errorCount = 0
  let skippedCount = 0

  for (const page of staticPages) {
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
  console.log(`📋 Total processed: ${staticPages.length}`)

  console.log('\n💡 Next steps:')
  console.log('1. Go to your Sanity Studio at http://localhost:3000/studio')
  console.log('2. Navigate to Static Pages')
  console.log('3. Review and edit the content as needed')
  console.log('4. Add images where appropriate')
  console.log('5. Customize the content for your specific needs')
}

// Run the script
addStaticPagesToSanity()
  .then(() => {
    console.log('\n✨ Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })