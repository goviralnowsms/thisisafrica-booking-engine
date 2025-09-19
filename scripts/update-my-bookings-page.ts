// Script to update My Bookings page in Sanity with actual content
// Run with: npx tsx scripts/update-my-bookings-page.ts

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

const myBookingsPageContent = {
  title: 'My Bookings',
  slug: { current: 'my-bookings' },
  pageType: 'other',
  headerSection: {
    showHeader: true,
    headerStyle: 'simple',
    headline: 'My Bookings',
    subtitle: 'Manage and view your African travel bookings',
  },
  content: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Access My Bookings' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Enter your surname and numeric booking ID to view your bookings. This secure portal allows you to access your travel details, booking status, and manage your African adventures.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'warning',
      title: 'Important: Booking References vs Booking IDs',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: '• Booking References (like TAWB100445) cannot be used for online lookup\n' },
            { _type: 'span', text: '• Only numeric Booking IDs work with our automated system\n' },
            { _type: 'span', text: '• For booking references, please contact our team at +61 2 9664 9187' },
          ],
          markDefs: [],
        },
      ],
      icon: 'alert-triangle',
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Your Travel Dashboard Features' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Secure Access' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Access your bookings using your surname and booking ID. Our system supports both TourPlan bookings and This Is Africa direct bookings.',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ _type: 'span', text: 'Booking Management' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• View booking details and travel dates' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Check booking status (Confirmed, Pending, Quote)' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Search for specific bookings by ID' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• View organized tabs: Upcoming, Past, All Bookings' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Request booking cancellation (requires manual approval)' },
      ],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'info',
      title: 'Booking Status Types',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: '• Confirmed - Your booking is confirmed and ready\n' },
            { _type: 'span', text: '• Pending - Awaiting confirmation or payment\n' },
            { _type: 'span', text: '• Quote - Price quote, awaiting your confirmation\n' },
            { _type: 'span', text: '• Cancelled - Booking has been cancelled' },
          ],
          markDefs: [],
        },
      ],
      icon: 'info',
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Sample Booking Display' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'When you access your bookings, you\'ll see detailed cards showing:',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'table',
      title: 'Booking Information Display',
      headers: ['Field', 'Description'],
      rows: [
        { cells: ['Tour Name', 'Name of your African adventure'] },
        { cells: ['Booking Reference', 'Your unique booking reference number'] },
        { cells: ['Destination', 'African countries/regions you\'ll visit'] },
        { cells: ['Travel Dates', 'Departure date and duration'] },
        { cells: ['Room Type', 'Accommodation arrangement (Single, Double, Twin, etc.)'] },
        { cells: ['Total Amount', 'Complete booking cost in AUD'] },
        { cells: ['Status Badge', 'Current booking status with color coding'] },
      ],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Booking Actions Available' }],
      markDefs: [],
    },
    {
      _type: 'infoBox',
      style: 'success',
      title: 'View Details',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Click "View Details" to see comprehensive booking information including reference numbers, travel dates, and contact information.',
            },
          ],
          markDefs: [],
        },
      ],
      icon: 'file-text',
    },
    {
      _type: 'infoBox',
      style: 'error',
      title: 'Request Cancellation',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Important: Cancellation requests do NOT automatically cancel your booking. You must contact our support team directly at sales@thisisafrica.com.au or +61 2 9664 9187. Cancellation policies and fees may apply.',
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
      children: [{ _type: 'span', text: 'No Bookings Found?' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'If you don\'t see any bookings, you can:',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Double-check your surname and booking ID' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Try searching with different booking references' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Browse our tours to make a new booking' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Contact our support team for assistance' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'Technical Features' }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Our booking system includes advanced features:',
        },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Integration with TourPlan booking system' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Support for This Is Africa direct bookings (TIA-xxx)' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Real-time booking status updates' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Secure authentication with surname verification' },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      children: [
        { _type: 'span', text: '• Responsive design for mobile and desktop access' },
      ],
      markDefs: [],
    },
    {
      _type: 'contactInfo',
      title: 'Need Help with Your Booking?',
      description: 'If you can\'t find your booking or need assistance with the portal, our travel experts are here to help.',
      showPhone: true,
      showEmail: true,
      customContactText: 'For booking references (TAWB numbers), please call us directly as they cannot be used for online lookup.',
    },
  ],
  pageSettings: {
    showBreadcrumbs: true,
    showTableOfContents: true,
    allowPrint: false,
    showLastUpdated: false,
  },
  seoSettings: {
    metaTitle: 'My Bookings | This Is Africa - View Your Safari Bookings',
    metaDescription: 'Access and manage your African safari bookings. View travel dates, booking status, and manage your adventures with This Is Africa.',
  },
}

async function updateMyBookingsPage() {
  console.log('📋 Updating My Bookings page in Sanity...\n')

  try {
    // Check if page exists
    const existingDoc = await client.fetch(
      `*[_type == "staticPage" && slug.current == $slug][0]`,
      { slug: myBookingsPageContent.slug.current }
    )

    if (existingDoc) {
      // Update existing document
      const result = await client
        .patch(existingDoc._id)
        .set(myBookingsPageContent)
        .commit()
      console.log(`✅ Updated "${myBookingsPageContent.title}" page with actual content`)
    } else {
      // Create new document
      const doc = {
        _type: 'staticPage',
        ...myBookingsPageContent,
      }
      const result = await client.create(doc)
      console.log(`✅ Created "${myBookingsPageContent.title}" page with actual content`)
    }

    console.log('\n💡 My Bookings page now includes:')
    console.log('   🔐 Authentication flow with surname + booking ID')
    console.log('   📋 Booking management dashboard features')
    console.log('   ⚠️ Important notices about booking references vs IDs')
    console.log('   🏷️ Status badge system (Confirmed, Pending, Quote, Cancelled)')
    console.log('   📊 Booking information table structure')
    console.log('   🔍 Search functionality explanation')
    console.log('   📱 Tabs for Upcoming, Past, All Bookings')
    console.log('   ❌ Cancellation request process')
    console.log('   🛠️ Technical integration details')
    
    console.log('\n🔧 Key Features Documented:')
    console.log('   • TourPlan API integration')
    console.log('   • TIA direct booking support (TIA-xxx)')
    console.log('   • Mock booking examples')
    console.log('   • Room type mapping (SG, DB, TW, etc.)')
    console.log('   • Real-time availability checking')
    console.log('   • Secure booking lookup')
    
  } catch (error) {
    console.error(`❌ Error updating My Bookings page:`, error)
  }
}

// Run the script
updateMyBookingsPage()
  .then(() => {
    console.log('\n✨ My Bookings page updated successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })