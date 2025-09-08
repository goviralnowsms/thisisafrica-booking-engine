/**
 * Script to create the employment page in Sanity CMS
 * Usage: node scripts/create-employment-page.js
 */

const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'h4qu7hkw',
  dataset: 'production',
  apiVersion: '2024-09-04',
  token: 'skUREaXA9lNLT1nmAZljtznXRIhMhsjsV3W2bmMmB9VdZGqUvfE7YasI6hoaYk1dppUKnHTz7KOpbxm4SkIQMi9XKiReiyL2861TwfhX6JshNHCKkAnuX6jYcQqziFsUIYaD3YT0gZV6djEzq1mHzWuMw13p9VZPBq7fxNfPWP4pzsrBE1ZP',
  useCdn: false,
});

async function createEmploymentPage() {
  try {
    console.log('📝 Creating Employment page in Sanity...');
    
    const employmentPage = {
      _type: 'staticPage',
      title: 'Employment Opportunities',
      slug: {
        _type: 'slug',
        current: 'employment'
      },
      pageType: 'other',
      heroSection: {
        showHero: true,
        headline: 'Join Our Team at This is Africa'
        // Hero image can be added later in Sanity Studio
      },
      content: [
        // Main content box with H2 title
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Currently seeking Full Time and Part Time Travel Consultants'
            }
          ]
        },
        
        // Second H2 title
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Why Join This is Africa?'
            }
          ]
        },
        
        // Paragraph about the company
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'This is Africa is a leading specialist in African travel, offering unique and authentic experiences across the continent. We pride ourselves on our expert knowledge, exceptional customer service, and passion for creating unforgettable journeys.'
            }
          ]
        },
        
        // H3 title for benefits
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: 'What We Offer'
            }
          ]
        },
        
        // 6 checkmark points
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '✓ Competitive salary and commission structure'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '✓ Comprehensive training on African destinations and products'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '✓ Familiarisation trips to experience Africa firsthand'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '✓ Supportive team environment with experienced colleagues'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '✓ Flexible working arrangements available'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '✓ Career development and progression opportunities'
            }
          ]
        },
        
        // Two columns section header
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: 'Key Responsibilities'
            }
          ]
        },
        
        // Column 1 - Customer Service
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '👤 ',
              marks: ['strong']
            },
            {
              _type: 'span',
              text: 'Customer Service Excellence',
              marks: ['strong']
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '• Provide expert advice on African destinations\n• Create customized itineraries to meet client needs\n• Build and maintain strong client relationships\n• Handle inquiries via phone, email, and in-person'
            }
          ]
        },
        
        // Column 2 - Sales & Admin
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '📊 ',
              marks: ['strong']
            },
            {
              _type: 'span',
              text: 'Sales & Administration',
              marks: ['strong']
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '• Meet and exceed sales targets\n• Process bookings and manage documentation\n• Coordinate with suppliers and partners\n• Maintain accurate client records and follow-ups'
            }
          ]
        },
        
        // Office Location
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: '📍 ',
              marks: ['strong']
            },
            {
              _type: 'span',
              text: 'Office Location: ',
              marks: ['strong']
            },
            {
              _type: 'span',
              text: 'Randwick, NSW - Close to public transport links'
            }
          ]
        },
        
        // CTA Box Header
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Ready to Start Your Journey with Us?'
            }
          ]
        },
        
        // CTA subtitle
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Send your resume and cover letter to begin your adventure in African travel'
            }
          ]
        },
        
        // CTA button/email
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Apply Now: ',
              marks: ['strong']
            },
            {
              _type: 'span',
              text: 'employment@thisisafrica.com.au',
              marks: [
                {
                  _type: 'link',
                  href: 'mailto:employment@thisisafrica.com.au'
                }
              ]
            }
          ]
        },
        
        // Application Process Section
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Application Process'
            }
          ]
        },
        
        // Step 1 - Search/Apply
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: '🔍 Step 1: Apply'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Submit your resume and cover letter highlighting your travel industry experience'
            }
          ]
        },
        
        // Step 2 - Interview
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: '👤 Step 2: Interview'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Selected candidates will be invited for an interview to discuss their passion for Africa'
            }
          ]
        },
        
        // Step 3 - Welcome
        {
          _type: 'block',
          style: 'h3',
          children: [
            {
              _type: 'span',
              text: '📞 Step 3: Welcome'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Successful applicants receive comprehensive training and join our passionate team'
            }
          ]
        }
      ],
      seoSettings: {
        metaTitle: 'Employment Opportunities - This is Africa',
        metaDescription: 'Join the This is Africa team. We are seeking passionate Full Time and Part Time Travel Consultants specializing in African destinations. Apply now.',
        noIndex: false
      }
    };
    
    // Check if employment page already exists
    const existingPage = await client.fetch('*[_type == "staticPage" && slug.current == "employment"][0]');
    
    if (existingPage) {
      console.log('⚠️ Employment page already exists, updating...');
      const result = await client
        .patch(existingPage._id)
        .set(employmentPage)
        .commit();
      console.log('✅ Employment page updated successfully!');
      console.log(`   ID: ${result._id}`);
    } else {
      const result = await client.create(employmentPage);
      console.log('✅ Employment page created successfully!');
      console.log(`   ID: ${result._id}`);
    }
    
    console.log('\n📌 Next steps:');
    console.log('1. Upload a hero banner image in Sanity Studio');
    console.log('2. Review and adjust the content as needed');
    console.log('3. The page will be available at /employment once integrated');
    console.log('\nVisit https://h4qu7hkw.sanity.studio to manage the content');
    
  } catch (error) {
    console.error('❌ Error creating employment page:', error.message);
    process.exit(1);
  }
}

// Run the script
createEmploymentPage();