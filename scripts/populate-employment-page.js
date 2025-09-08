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

const employmentPageContent = {
  _type: 'employmentPage',
  title: 'Employment',
  slug: { current: 'employment', _type: 'slug' },
  
  // Hero Section
  heroSection: {
    mainHeadline: 'Join Our Team',
    primarySubtitle: 'Share Your Passion for African Travel',
    secondarySubtitle: 'Build a rewarding career helping travelers discover the magic of Africa while working with a passionate team of travel specialists'
  },
  
  // Current Positions Banner
  currentPositions: {
    showBanner: true,
    announcement: 'Currently seeking Full Time and Part Time Travel Consultants'
  },
  
  // Introduction Section
  introduction: {
    questionHeading: 'Have you been to Africa and are you passionate about travel?',
    description: 'This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling tailor-made and package tours to Africa. To meet the demands of our growing business we are regularly seeking staff members to join our friendly team. Our office is situated in Randwick NSW and is close to public transport links.'
  },
  
  // Career Benefits (6 checkmark points)
  careerBenefits: {
    sectionTitle: 'Why Choose a Career in African Travel?',
    benefits: [
      {
        text: 'Work with passionate travelers and share your love for Africa while helping others plan their dream adventures'
      },
      {
        text: 'Gain expertise in specialized African destinations, wildlife, and cultural experiences that few travel consultants possess'
      },
      {
        text: 'Enjoy competitive compensation with performance bonuses and travel incentives to experience destinations firsthand'
      },
      {
        text: 'Flexible work arrangements available including part-time positions and remote work opportunities for experienced consultants'
      },
      {
        text: 'Continuous professional development through destination training, industry conferences, and familiarization trips to Africa'
      },
      {
        text: 'Be part of a close-knit team that values collaboration, cultural diversity, and making a positive impact through responsible tourism'
      }
    ]
  },
  
  // Position Details
  positionDetails: {
    sectionTitle: 'Travel Consultant Positions Available',
    positions: [
      {
        title: 'Full Time Travel Consultant',
        type: 'Full-time',
        description: 'Join our core team of African travel specialists and help clients plan comprehensive safari and cultural tours across the continent.',
        keyResponsibilities: [
          'Consult with clients to understand their travel preferences and budget requirements',
          'Design custom African itineraries including safaris, cultural tours, and adventure experiences',
          'Process bookings using our specialized booking systems and TourPlan platform',
          'Maintain relationships with African tour operators, lodges, and transport providers',
          'Provide pre-travel advice and destination expertise to ensure memorable experiences',
          'Handle booking modifications, special requests, and travel documentation requirements'
        ],
        workingHours: 'Monday to Friday 9:00am - 5:30pm, Saturday morning roster (by appointment)',
        benefits: [
          'Competitive salary package with performance bonuses',
          'Travel allowances and familiarization trip opportunities',
          'Comprehensive health insurance and superannuation',
          'Professional development and destination training',
          'Flexible leave arrangements for personal travel',
          'Modern office environment with latest booking technology'
        ]
      },
      {
        title: 'Part Time Travel Consultant',
        type: 'Part-time',
        description: 'Perfect for experienced travel consultants seeking flexible hours while specializing in African destinations.',
        keyResponsibilities: [
          'Handle client inquiries and bookings during scheduled hours',
          'Provide specialized African destination knowledge and recommendations',
          'Support busy periods and cover for full-time staff when needed',
          'Maintain client relationships and follow up on travel experiences',
          'Process group bookings and special interest tours',
          'Assist with marketing campaigns and travel promotions'
        ],
        workingHours: 'Flexible scheduling: 2-4 days per week, including some Saturday mornings',
        benefits: [
          'Hourly rate commensurate with experience',
          'Flexible working arrangements to suit lifestyle',
          'Access to travel discounts and familiarization opportunities',
          'Professional development and ongoing training',
          'Opportunity to grow into full-time role',
          'Supportive team environment with mentoring'
        ]
      }
    ]
  },
  
  // Requirements Section
  requirements: {
    sectionTitle: 'What We\'re Looking For',
    essentialRequirements: [
      'Previous travel industry experience, preferably in retail or wholesale travel consulting',
      'Personal travel experience in Africa (safari, cultural tours, or adventure travel)',
      'Strong customer service skills with ability to build rapport with diverse clients',
      'Excellent written and verbal communication skills',
      'Proficiency with booking systems, GDS, or willingness to learn specialized platforms',
      'Detail-oriented approach to handling travel documentation and booking requirements'
    ],
    desirableRequirements: [
      'Formal qualifications in Travel and Tourism or related field',
      'Experience with African destinations, wildlife, and cultural tourism',
      'Knowledge of visa requirements, health regulations, and travel insurance',
      'Multilingual skills (French, German, or African languages an advantage)',
      'Experience with group travel, adventure tours, or specialized tourism',
      'Social media and digital marketing experience for travel promotion'
    ]
  },
  
  // Company Culture Section
  companyCulture: {
    sectionTitle: 'Our Company Culture',
    subtitle: 'What Makes This is Africa Special',
    description: 'We believe that travel has the power to transform lives and create meaningful connections between cultures. Our team is passionate about showcasing the real Africa - its incredible wildlife, rich cultures, and warm hospitality.',
    culturePoints: [
      {
        icon: 'users',
        title: 'Collaborative Team Environment',
        description: 'Work alongside passionate travel professionals who support each other and share knowledge freely'
      },
      {
        icon: 'globe',
        title: 'Responsible Tourism Focus',
        description: 'We partner with local operators who prioritize conservation and community development'
      },
      {
        icon: 'award',
        title: 'Excellence in Service',
        description: 'We strive to exceed client expectations and create unforgettable African experiences'
      },
      {
        icon: 'heart',
        title: 'Passion for Africa',
        description: 'Our love for the continent drives everything we do, from planning trips to supporting local communities'
      }
    ]
  },
  
  // Development Opportunities
  developmentOpportunities: {
    sectionTitle: 'Professional Development',
    subtitle: 'Grow Your Career in African Travel',
    opportunities: [
      {
        title: 'Destination Familiarization Trips',
        description: 'Experience African destinations firsthand through subsidized familiarization tours to enhance your destination knowledge and sales effectiveness.'
      },
      {
        title: 'Industry Training & Certification',
        description: 'Access to specialist training programs, tourism board certifications, and industry conferences to advance your expertise.'
      },
      {
        title: 'Mentorship Programs',
        description: 'Learn from experienced Africa specialists through structured mentoring and knowledge sharing sessions.'
      },
      {
        title: 'Career Progression Opportunities',
        description: 'Clear pathways for advancement including senior consultant roles, team leadership, and specialized departments.'
      }
    ]
  },
  
  // Application Process
  applicationProcess: {
    sectionTitle: 'How to Apply',
    steps: [
      {
        step: 1,
        title: 'Submit Your Application',
        description: 'Send your resume and a cover letter explaining your passion for African travel and relevant experience.'
      },
      {
        step: 2,
        title: 'Initial Interview',
        description: 'Participate in a phone or video interview to discuss your background and interest in African travel.'
      },
      {
        step: 3,
        title: 'Skills Assessment',
        description: 'Complete a practical assessment including destination knowledge and customer service scenarios.'
      },
      {
        step: 4,
        title: 'Final Interview',
        description: 'Meet with our team in person to discuss the role and experience our office culture.'
      }
    ],
    additionalInfo: 'Applications are reviewed on a rolling basis. Strong candidates may be invited to start immediately with comprehensive training provided.'
  },
  
  // Contact Section
  contactSection: {
    sectionTitle: 'Ready to Start Your African Travel Career?',
    subtitle: 'We\'d love to hear from you',
    description: 'Send your application or ask questions about our current opportunities. We welcome inquiries from passionate travel professionals at all experience levels.',
    email: 'careers@thisisafrica.com.au',
    phone: '+61 2 9664 9187',
    address: '51 Frenchmans Rd, Randwick NSW 2031',
    officeHours: 'Monday to Friday: 9:00am - 5:30pm'
  },
  
  // CTA Buttons
  callToActions: {
    primaryCta: {
      text: 'Apply Now',
      link: 'mailto:careers@thisisafrica.com.au?subject=Travel Consultant Application',
      style: 'primary'
    },
    secondaryCta: {
      text: 'Download Job Description',
      link: '/careers/travel-consultant-job-description.pdf',
      style: 'secondary'
    }
  },
  
  // SEO Settings
  seoSettings: {
    metaTitle: 'Careers - Travel Consultant Jobs | This is Africa Travel',
    metaDescription: 'Join our passionate team of African travel specialists. Full-time and part-time travel consultant positions available. Apply your Africa experience to help others plan dream adventures.',
    keywords: 'travel jobs, African travel careers, travel consultant, tourism jobs, safari specialist, travel agent positions',
    noIndex: false
  },
  
  // Page Settings
  pageSettings: {
    showBreadcrumbs: true,
    allowPrint: true,
    showLastUpdated: true
  }
}

async function populateEmploymentPage() {
  try {
    console.log('🚀 Populating employment page content...')
    
    // Check if employment page already exists
    const existingPage = await client.fetch(`*[_type == "employmentPage"][0]`)
    
    if (existingPage) {
      console.log('📝 Updating existing employment page...')
      const result = await client
        .patch(existingPage._id)
        .set(employmentPageContent)
        .commit()
      console.log('✅ Employment page updated successfully!')
    } else {
      console.log('📄 Creating new employment page...')
      const result = await client.create(employmentPageContent)
      console.log('✅ Employment page created successfully!')
    }
    
    console.log('🎉 Employment page is now fully populated!')
    console.log('🔧 You can view/edit it in Sanity Studio at: http://localhost:3005/studio')
    console.log('🌐 View the page at: http://localhost:3005/employment')
    
  } catch (error) {
    console.error('❌ Error populating employment page:', error)
  }
}

populateEmploymentPage()