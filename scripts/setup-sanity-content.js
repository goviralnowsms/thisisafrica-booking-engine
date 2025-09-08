require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

// Debug environment variables
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-09-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Essential static pages content
const staticPages = [
  {
    _type: 'staticPage',
    title: 'Terms & Conditions',
    slug: { current: 'terms-conditions', _type: 'slug' },
    pageType: 'terms',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Terms & Conditions',
      subtitle: 'Please read these terms carefully before booking your African adventure.',
      lastUpdated: 'Last updated: September 2025'
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '1. Booking Terms' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'All bookings are subject to availability and confirmation from our tour operators. A deposit is required to secure your booking.' }]
      },
      {
        _type: 'block',
        style: 'h2', 
        children: [{ _type: 'span', text: '2. Payment Terms' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Full payment is due 60 days prior to departure unless otherwise specified. We accept major credit cards and bank transfers.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: '3. Cancellation Policy' }]
      },
      {
        _type: 'block',
        style: 'normal', 
        children: [{ _type: 'span', text: 'Cancellation fees apply based on proximity to departure date. Please refer to your booking confirmation for specific terms.' }]
      }
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: true,
      allowPrint: true,
      showLastUpdated: true
    },
    seoSettings: {
      metaTitle: 'Terms & Conditions - This is Africa Travel',
      metaDescription: 'Read our booking terms, payment policies, and cancellation conditions for African travel tours.',
      noIndex: false
    }
  },
  {
    _type: 'staticPage',
    title: 'Privacy Policy',
    slug: { current: 'privacy-policy', _type: 'slug' },
    pageType: 'privacy',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Privacy Policy',
      subtitle: 'How we collect, use, and protect your personal information.',
      lastUpdated: 'Last updated: September 2025'
    },
    content: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Information We Collect' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'We collect information you provide when booking tours, subscribing to newsletters, or contacting us. This includes name, email, phone number, and travel preferences.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'How We Use Your Information' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Your information is used to process bookings, provide customer service, send travel updates, and improve our services. We never sell your personal data to third parties.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Data Security' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse.' }]
      }
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: true,
      allowPrint: true,
      showLastUpdated: true
    },
    seoSettings: {
      metaTitle: 'Privacy Policy - This is Africa Travel',
      metaDescription: 'Learn how This is Africa Travel protects your privacy and handles your personal data.',
      noIndex: false
    }
  },
  {
    _type: 'staticPage',
    title: 'Travel Information',
    slug: { current: 'travel-information', _type: 'slug' },
    pageType: 'travel-info',
    headerSection: {
      showHeader: true,
      headerStyle: 'simple',
      headline: 'Travel Information',
      subtitle: 'Essential information for your African adventure.',
      lastUpdated: 'Last updated: September 2025'
    },
    content: [
      {
        _type: 'infoBox',
        style: 'info',
        title: 'Important Notice',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Please check current visa requirements and health advisories before travel.' }]
          }
        ],
        icon: 'info'
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Visa Requirements' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Most African countries require a valid visa for entry. Requirements vary by nationality and destination. We recommend checking with the relevant embassy or consulate at least 6-8 weeks before departure.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Health & Vaccinations' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Consult your doctor or travel clinic about recommended vaccinations. Yellow fever vaccination may be required for certain destinations. Malaria prophylaxis is recommended for most African destinations.' }]
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'What to Pack' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Pack light, comfortable clothing suitable for warm days and cool evenings. Essential items include sunscreen, insect repellent, comfortable walking shoes, and a good camera for wildlife photography.' }]
      }
    ],
    pageSettings: {
      showBreadcrumbs: true,
      showTableOfContents: true,
      allowPrint: true,
      showLastUpdated: true
    },
    seoSettings: {
      metaTitle: 'Travel Information - This is Africa Travel',
      metaDescription: 'Essential travel information for African tours including visa requirements, health advice, and packing tips.',
      noIndex: false
    }
  }
]

// Contact page content
const contactPageContent = {
  _type: 'contactPage',
  title: 'Contact Us',
  slug: { current: 'contact', _type: 'slug' },
  headerSection: {
    mainTitle: 'Get a Quote',
    subtitle: 'Tell us about your dream African adventure',
    backLinkText: 'Browse Tours',
    backLinkUrl: '/booking'
  },
  contactForm: {
    nameFieldLabel: 'Full Name',
    namePlaceholder: 'Your full name',
    emailFieldLabel: 'Email Address',
    emailPlaceholder: 'your@email.com',
    phoneFieldLabel: 'Phone Number',
    phonePlaceholder: '+61 XXX XXX XXX',
    travelersFieldLabel: 'Number of Travelers',
    dateFieldLabel: 'Preferred Travel Date',
    messageFieldLabel: 'Message',
    messagePlaceholder: 'Tell us about your dream African adventure. Include any special requirements, preferences, or questions you have.',
    submitButtonText: 'Send Quote Request',
    submittingText: 'Sending...',
    termsText: 'I agree with Terms & Conditions and Privacy Policy'
  },
  contactInfo: {
    sectionTitle: 'Contact Information',
    phoneSection: {
      icon: 'phone',
      label: 'Phone',
      number: '+61 2 9664 9187',
      hours: 'Mon-Fri: 9:00am-5:00pm | Sat: by appointment'
    },
    emailSection: {
      icon: 'mail',
      label: 'Email',
      address: 'sales@thisisafrica.com.au',
      responseTime: 'We respond within 24 hours Mon-Fri'
    },
    officeSection: {
      icon: 'map-pin',
      label: 'Office',
      address: '51 Frenchmans Rd\nRandwick NSW 2031'
    }
  },
  whyQuoteSection: {
    title: 'Why Get a Quote?',
    benefits: [
      'Personalized itinerary recommendations',
      'Best available pricing and deals',
      'Expert advice from Africa specialists',
      'Flexible payment options'
    ]
  },
  successPage: {
    successIcon: 'send',
    successTitle: 'Message Sent Successfully!',
    successMessage: 'Thank you for your inquiry. Our travel experts will review your request and get back to you within 24 hours with a personalized quote.',
    nextStepsTitle: 'What happens next?',
    nextSteps: [
      'Our team will review your requirements',
      'We\'ll check availability for your preferred dates',
      'You\'ll receive a detailed quote within 24 hours',
      'We\'ll follow up to discuss your perfect African adventure'
    ],
    primaryButtonText: 'Return Home',
    primaryButtonUrl: '/',
    secondaryButtonText: 'Browse More Tours',
    secondaryButtonUrl: '/booking'
  },
  formSettings: {
    enableTourPreFill: true,
    enableBrochureRequest: true,
    brochureRequestMessage: 'Please send me a printed brochure.\n\nI would like to receive your latest travel brochure with details of all your African tours and packages.',
    tourRequestTemplate: 'I am interested in getting a quote for the tour: {TOUR_NAME}\n\nPlease provide pricing and availability details.',
    recipientEmail: 'sales@thisisafrica.com.au',
    requireTermsAgreement: true
  },
  seoSettings: {
    metaTitle: 'Contact Us - This is Africa Travel',
    metaDescription: 'Get a personalized quote for your African adventure. Contact our travel experts for customized itineraries, pricing, and expert advice.',
    noIndex: false
  }
}

// Sample testimonials
const testimonials = [
  {
    _type: 'testimonial',
    name: 'Sarah Johnson',
    location: 'Sydney, Australia',
    tourName: 'East African Explorer',
    rating: 5,
    quote: 'Absolutely incredible experience! The wildlife viewing was beyond our expectations and our guide was phenomenal.',
    date: '2024-08-15',
    featured: true
  },
  {
    _type: 'testimonial',
    name: 'Mike Chen',
    location: 'Melbourne, Australia', 
    tourName: 'Classic Kenya Safari',
    rating: 5,
    quote: 'This is Africa delivered exactly what they promised. Professional service from start to finish.',
    date: '2024-07-22',
    featured: true
  },
  {
    _type: 'testimonial',
    name: 'Emma Williams',
    location: 'Perth, Australia',
    tourName: 'Tanzania Highlights',
    rating: 5,
    quote: 'The Ngorongoro Crater was breathtaking. Highly recommend this tour operator for African safaris.',
    date: '2024-06-10',
    featured: false
  }
]

async function setupContent() {
  try {
    console.log('🚀 Setting up Sanity content...')
    
    // Create static pages
    console.log('📄 Creating static pages...')
    for (const page of staticPages) {
      const result = await client.create(page)
      console.log(`✅ Created: ${page.title}`)
    }
    
    // Create contact page
    console.log('📞 Creating contact page...')
    const contactResult = await client.create(contactPageContent)
    console.log('✅ Created: Contact page')
    
    // Create testimonials
    console.log('⭐ Creating testimonials...')
    for (const testimonial of testimonials) {
      const result = await client.create(testimonial)
      console.log(`✅ Created testimonial: ${testimonial.name}`)
    }
    
    console.log('🎉 Sanity content setup completed successfully!')
    console.log('🔧 You can now access Sanity Studio at: http://localhost:3005/studio')
    
  } catch (error) {
    console.error('❌ Error setting up content:', error)
  }
}

setupContent()