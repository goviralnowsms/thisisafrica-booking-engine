// Script to add initial site settings to Sanity
// Run with: npx tsx scripts/add-site-settings.ts

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

const siteSettingsData = {
  _type: 'siteSettings',
  title: 'This Is Africa',
  header: {
    phone: '+61 2 9664 9187',
    email: 'sales@thisisafrica.com.au',
    officeHours: 'Mon-Fri: 9:00am-5:00pm AEST',
    tagline: 'African Travel Specialists Since 1999',
    showContactInfo: true,
  },
  footer: {
    companyName: 'This Is Africa Pty Ltd',
    abn: 'ABN 32 606 195 895',
    licenseNumber: 'LTA 5865',
    address: {
      street: '51 Frenchmans Rd',
      suburb: 'Randwick',
      state: 'NSW',
      postcode: '2031',
      country: 'Australia',
    },
    phone: '+61 2 9664 9187',
    email: 'sales@thisisafrica.com.au',
    officeHours: 'Monday - Friday: 9:00am - 5:00pm AEST\nSaturday: By appointment only\nSunday: Closed',
    copyrightText: '© 2025 This Is Africa Pty Ltd. All rights reserved.',
    description: 'Your trusted African travel specialists since 1999. We create unforgettable safari experiences across Africa with personalized service and expert local knowledge.',
  },
  contact: {
    mainPhone: '+61 2 9664 9187',
    salesEmail: 'sales@thisisafrica.com.au',
    supportEmail: 'support@thisisafrica.com.au',
    emergencyPhone: '+61 404 XXX XXX',
    whatsapp: '+61 2 9664 9187',
  },
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
  },
  seo: {
    metaTitle: 'This Is Africa | African Safari Specialists Since 1999',
    metaDescription: 'Plan your perfect African safari with This Is Africa. Expert travel specialists offering tailor-made safaris, group tours, and luxury experiences across Africa since 1999.',
    keywords: [
      'African Safari',
      'Safari Tours',
      'African Travel',
      'Kenya Safari',
      'Tanzania Safari',
      'South Africa Tours',
      'Botswana Safari',
      'Group Tours',
      'Luxury Safari',
      'Tailor Made Tours'
    ],
    googleAnalyticsId: '',
    googleTagManagerId: '',
  },
  business: {
    establishedYear: 1999,
    specialties: [
      'African Safaris',
      'Group Tours', 
      'Luxury Travel',
      'Tailor-Made Tours',
      'Wildlife Photography Tours',
      'Cultural Experiences'
    ],
    certifications: [
      'Licensed Travel Agent (LTA 5865)',
      'AFTA Member',
      'Specialist Africa Travel Operator'
    ],
  },
  emergency: {
    afterHoursContact: 'For travel emergencies, contact your travel insurance provider or local emergency services',
    importantNotice: '',
    showImportantNotice: false,
  },
}

async function addSiteSettings() {
  console.log('⚙️  Adding site settings to Sanity...\n')

  try {
    // Check if site settings already exist
    const existingSettings = await client.fetch(
      `*[_type == "siteSettings"][0]`
    )

    if (existingSettings) {
      console.log('⏭️  Site settings already exist, updating...')
      const result = await client
        .patch(existingSettings._id)
        .set(siteSettingsData)
        .commit()
      console.log('✅ Updated existing site settings')
    } else {
      const result = await client.create(siteSettingsData)
      console.log('✅ Created new site settings document')
    }

    console.log('\n💡 What you can now edit in Sanity Studio:')
    console.log('   📞 Phone numbers (header, footer, contact)')
    console.log('   📧 Email addresses (sales, support)')
    console.log('   🏢 Business address and details')
    console.log('   🕐 Office hours and contact information')
    console.log('   💼 Business information (ABN, license)')
    console.log('   🔗 Social media links')
    console.log('   🔍 SEO settings (meta titles, descriptions)')
    console.log('   ⚠️  Emergency information and notices')
    
    console.log('\n🎯 Access via Sanity Studio:')
    console.log('   1. Go to http://localhost:3003/studio')
    console.log('   2. Look for "Site Settings" in the sidebar')
    console.log('   3. Edit any contact information, business details, etc.')
    console.log('   4. Your changes will automatically update across the site')

  } catch (error) {
    console.error('❌ Error adding site settings:', error)
  }
}

// Run the script
addSiteSettings()
  .then(() => {
    console.log('\n✨ Site settings added successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })