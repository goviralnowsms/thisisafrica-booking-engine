require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@sanity/client')

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-09-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Extract the EXACT content from the current employment page
const existingEmploymentContent = {
  _type: 'employmentPage',
  title: 'Employment',
  slug: { current: 'employment', _type: 'slug' },
  
  // Hero Section (from existing page)
  heroSection: {
    mainHeadline: 'Employment',
    primarySubtitle: 'Join our passionate team of African travel specialists',
    secondarySubtitle: 'Experience the rewarding career of sharing Africa\'s magic with fellow travelers while building your expertise in specialized travel consulting'
  },
  
  // Current Positions Banner (from existing yellow banner)
  currentPositions: {
    showBanner: true,
    announcement: 'Currently seeking Full Time and Part Time Travel Consultants'
  },
  
  // Introduction Section (from existing content)
  introduction: {
    questionHeading: 'Have you been to Africa and are you passionate about travel?',
    description: 'This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling tailor-made and package tours to Africa. To meet the demands of our growing business we are regularly seeking staff members to join our friendly team. Our office is situated in Randwick NSW and is close to public transport links.'
  },
  
  // Career Benefits (from existing 6-point checkmark section)
  careerBenefits: {
    sectionTitle: 'Why Choose a Career in African Travel?',
    benefits: [
      {
        text: 'Turn your African travel experiences into meaningful career expertise'
      },
      {
        text: 'Work with clients who share your passion for adventure and discovery'
      },
      {
        text: 'Continuous learning through educational trips and industry training'
      },
      {
        text: 'Build lasting relationships with suppliers and travel partners across Africa'
      },
      {
        text: 'Contribute to sustainable tourism that benefits local African communities'
      },
      {
        text: 'Develop specialized skills in luxury travel, safari planning, and cultural experiences'
      }
    ]
  },
  
  // Position Details (from existing "Reservations Consultant" section)
  positionDetails: {
    sectionTitle: 'Reservations Consultant',
    positions: [
      {
        title: 'Reservations Consultant',
        type: 'Full-time/Part-time',
        description: 'Consultants are predominately advising travel agents and the general public about our products and making reservations. Good writing skills and attention to detail are required when compiling quotes and itineraries for clients. Our team environment allows you plenty of opportunity to expand your marketing, product sourcing and airline ticketing (Galileo) skills. Experience in client management and general office skills, such as answering phones and using Microsoft Office is required. If you love Africa and have the drive and passion to inspire others to experience it too, then we would like to hear from you.',
        keyResponsibilities: [
          'Advising travel agents and general public about African travel products',
          'Making reservations and compiling detailed quotes and itineraries',
          'Client management and providing exceptional customer service',
          'Expanding marketing and product sourcing skills',
          'Airline ticketing using Galileo booking system',
          'General office duties including phone handling and Microsoft Office'
        ],
        workingHours: 'Monday to Friday, Tuesday to Saturday (every third week)',
        benefits: [
          'Good salary + super',
          '4 weeks annual leave',
          'Regular educational leave to Africa'
        ]
      }
    ]
  },
  
  // Requirements (from existing "successful candidate must have" section)
  requirements: {
    sectionTitle: 'The successful candidate must have:',
    essentialRequirements: [
      'Travelled to Africa (please do not apply if you haven\'t)',
      'Excellent Galileo and Smartpoint skills',
      'Excellent writing skills',
      'Enthusiasm and a good work ethic',
      'Travel industry experience',
      'Past history of consistent long periods of employment'
    ],
    desirableRequirements: []
  },
  
  // Company Culture (from existing grid sections)
  companyCulture: {
    sectionTitle: 'Why Work at This is Africa?',
    subtitle: '',
    description: '',
    culturePoints: [
      {
        icon: 'briefcase',
        title: 'Growing Company',
        description: 'Be part of a rapidly expanding wholesale and retail travel company'
      },
      {
        icon: 'globe',
        title: 'African Specialists',
        description: 'Work with the leading specialists in African adventure travel'
      },
      {
        icon: 'heart',
        title: 'Passionate Team',
        description: 'Join like-minded colleagues who share your passion for Africa'
      }
    ]
  },
  
  // Development Opportunities (from existing Career Development section)
  developmentOpportunities: {
    sectionTitle: 'Career Development',
    subtitle: 'Expand Your Skills and Knowledge',
    opportunities: [
      {
        title: 'Advanced Booking System Training',
        description: 'Advanced Galileo and booking system training to enhance your technical skills'
      },
      {
        title: 'Marketing & Product Sourcing',
        description: 'Marketing and product sourcing skill development opportunities'
      },
      {
        title: 'Educational Trips to Africa',
        description: 'First-hand destination knowledge through educational trips to Africa'
      },
      {
        title: 'Industry Certifications',
        description: 'Airline ticketing and industry certification opportunities'
      }
    ]
  },
  
  // Additional Benefits (from existing grid sections)
  additionalBenefits: {
    package: [
      'Good salary + super',
      '4 weeks annual leave',
      'Regular educational leave to Africa'
    ],
    teamCulture: [
      'Friendly, collaborative team environment',
      'Share your passion for Africa with like-minded colleagues',
      'Contribute to inspiring life-changing travel experiences',
      'Build expertise in luxury and adventure travel markets'
    ]
  },
  
  // Contact Section (from existing CTA section)
  contactSection: {
    sectionTitle: 'Start Your African Travel Career',
    subtitle: 'Join the leading specialists in African adventure travel',
    description: 'Take the next step in your travel career by joining our passionate team. Send us your resume, covering letter, and a list of African countries you\'ve experienced firsthand.',
    email: 'employment@thisisafrica.com.au',
    phone: '+61 2 9664 9187',
    address: 'Randwick, NSW - Close to public transport links',
    officeHours: 'Monday to Friday, Tuesday to Saturday (every third week)'
  },
  
  // CTA Buttons (from existing page)
  callToActions: {
    primaryCta: {
      text: 'Apply Now - employment@thisisafrica.com.au',
      link: 'mailto:employment@thisisafrica.com.au',
      style: 'primary'
    },
    secondaryCta: {
      text: 'View Our Tours',
      link: '/booking',
      style: 'secondary'
    }
  },
  
  // SEO Settings
  seoSettings: {
    metaTitle: 'Employment - Travel Consultant Jobs | This is Africa',
    metaDescription: 'Join our team of African travel specialists. Seeking experienced travel consultants with Africa travel experience. Good salary, benefits, and educational trips.',
    keywords: 'travel jobs, African travel careers, travel consultant, reservations consultant, Galileo, tourism jobs',
    noIndex: false
  },
  
  // Page Settings
  pageSettings: {
    showBreadcrumbs: true,
    allowPrint: true,
    showLastUpdated: true
  }
}

async function migrateEmploymentContent() {
  try {
    console.log('🚀 Migrating existing employment page content to Sanity...')
    
    // Check if employment page already exists
    const existingPage = await client.fetch(`*[_type == "employmentPage"][0]`)
    
    if (existingPage) {
      console.log('📝 Updating existing employment page with current content...')
      const result = await client
        .patch(existingPage._id)
        .set(existingEmploymentContent)
        .commit()
      console.log('✅ Employment page updated with existing content!')
    } else {
      console.log('📄 Creating new employment page with existing content...')
      const result = await client.create(existingEmploymentContent)
      console.log('✅ Employment page created with existing content!')
    }
    
    console.log('🎉 Migration completed successfully!')
    console.log('📝 The existing employment page content has been preserved in Sanity')
    console.log('🔧 You can view/edit it in Sanity Studio at: http://localhost:3005/studio')
    console.log('🌐 View the page at: http://localhost:3005/employment')
    
  } catch (error) {
    console.error('❌ Error migrating employment content:', error)
  }
}

migrateEmploymentContent()