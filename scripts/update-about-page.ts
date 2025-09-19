// Script to update About page in Sanity with actual content
// Run with: npx tsx scripts/update-about-page.ts

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

const aboutPageContent = {
  title: 'About Us',
  slug: { current: 'about' },
  pageType: 'other',
  headerSection: {
    showHeader: true,
    headerStyle: 'hero',
    headline: 'About',
    subtitle: 'Your trusted African travel specialists since 1999',
  },
  content: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Experience Africa with Confidence' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'The African continent includes over 50 countries, each with individual tribal groups, traditions, dialects and unique species. It is these characteristics which make Africa such an exciting, interesting and unique destination. Distances can be vast and many countries customs and practices can differ from most western countries, which is part of the excitement. That is why a reliable, experienced and well-qualified travel company offering the right travel company will be the best choice.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Having represented African tour operators in Australia since 1999, the director of This is Africa has had team from over 40 years of extensive knowledge and experience in promoting Africa. As a result, This is Africa offers creative and innovative packages which will make your African journey as interesting as your destination. We specialise in tailor-made and packaged tours for leisure and business travellers. Whether you want luxury, mid to accommodation and a personalised service or whether you are on a tight budget and want to stretch your legs as far as possible, we can service all travellers.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Responsible Travel' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'One of our operators are African-based and most of the travel wholesalers and lodges we feature support local charities and assist with projects in local communities. Many game lodges not only support the local community by offering employment, but also provide financial assistance to local schools, orphanages, medical clinics and animal rehabilitation centres. Rest assured that your visit to Africa will benefit the people you meet and the extended local community.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Licensed Agent' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'This is Africa is a licensed travel agent (LTA 5865).',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Why Choose This is Africa?' }],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Our Expertise',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: '✓ Expert Knowledge - Over 40 years of extensive experience in promoting African travel\n' },
            { _type: 'span', text: '✓ 50+ Countries - Extensive coverage across the entire African continent\n' },
            { _type: 'span', text: '✓ Licensed Agent - Fully licensed travel agent (LTA 5865) for your peace of mind\n' },
            { _type: 'span', text: '✓ Tailor-Made - Customized tours designed to match your interests and budget' },
          ],
          markDefs: [],
        },
      ],
      icon: 'award',
    },
    {
      _type: 'contactInfo',
      title: 'Ready to Experience Africa?',
      description: 'Let our expertise guide you through the adventure of a lifetime. Contact us today to start planning your African journey.',
      showPhone: true,
      showEmail: true,
    },
  ],
  pageSettings: {
    showBreadcrumbs: true,
    showTableOfContents: false,
    allowPrint: true,
    showLastUpdated: false,
  },
  seoSettings: {
    metaTitle: 'About Us | This Is Africa - African Travel Specialists Since 1999',
    metaDescription: 'Learn about This Is Africa, your trusted African travel specialists with over 40 years experience. Licensed travel agent (LTA 5865) offering tailor-made African safaris.',
  },
}

async function updateAboutPage() {
  console.log('📄 Updating About page in Sanity...\n')

  try {
    // Check if page exists
    const existingDoc = await client.fetch(
      `*[_type == "staticPage" && slug.current == $slug][0]`,
      { slug: aboutPageContent.slug.current }
    )

    if (existingDoc) {
      // Update existing document
      const result = await client
        .patch(existingDoc._id)
        .set(aboutPageContent)
        .commit()
      console.log(`✅ Updated "${aboutPageContent.title}" page with actual content`)
    } else {
      // Create new document
      const doc = {
        _type: 'staticPage',
        ...aboutPageContent,
      }
      const result = await client.create(doc)
      console.log(`✅ Created "${aboutPageContent.title}" page with actual content`)
    }

    console.log('\n💡 Next: Update the page in Sanity Studio to add the hero image')
    console.log('   Image path: /images/products/about-us.jpg')
  } catch (error) {
    console.error(`❌ Error updating About page:`, error)
  }
}

// Run the script
updateAboutPage()
  .then(() => {
    console.log('\n✨ About page updated successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })