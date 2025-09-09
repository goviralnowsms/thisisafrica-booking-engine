import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'employmentPage',
  title: 'Employment Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Employment',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL path for this page (e.g., /employment)',
    }),
    
    // Hero Section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'heroImage',
          title: 'Hero Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        }),
        defineField({
          name: 'mainHeadline',
          title: 'Main Headline',
          type: 'string',
          initialValue: 'Employment',
        }),
        defineField({
          name: 'primarySubtitle',
          title: 'Primary Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Join our passionate team of African travel specialists',
        }),
        defineField({
          name: 'secondarySubtitle',
          title: 'Secondary Subtitle',
          type: 'text',
          rows: 2,
          initialValue: 'Experience the rewarding career of sharing Africa\'s magic with fellow travelers while building your expertise in specialized travel consulting',
        }),
      ],
    }),

    // Current Positions Banner
    defineField({
      name: 'currentPositions',
      title: 'Current Positions Banner',
      type: 'object',
      fields: [
        defineField({
          name: 'showBanner',
          title: 'Show Current Positions Banner',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'announcement',
          title: 'Position Announcement',
          type: 'string',
          initialValue: 'Currently seeking Full Time and Part Time Travel Consultants',
        }),
      ],
    }),

    // Introduction Section
    defineField({
      name: 'introduction',
      title: 'Introduction Section',
      type: 'object',
      fields: [
        defineField({
          name: 'questionHeading',
          title: 'Question Heading',
          type: 'string',
          initialValue: 'Have you been to Africa and are you passionate about travel?',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          initialValue: 'This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling tailor-made and package tours to Africa. To meet the demands of our growing business we are regularly seeking staff members to join our friendly team. Our office is situated in Randwick NSW and is close to public transport links.',
        }),
      ],
    }),

    // Career Benefits Section (6 checkmark points)
    defineField({
      name: 'careerBenefits',
      title: 'Career Benefits Section',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Choose a Career in African Travel?',
        }),
        defineField({
          name: 'benefits',
          title: 'Career Benefits',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'benefit',
              fields: [
                {
                  name: 'text',
                  title: 'Benefit Text',
                  type: 'text',
                  rows: 2,
                },
              ],
            },
          ],
          validation: (Rule) => Rule.max(6),
          description: 'Maximum 6 benefits (displays in 2 columns with checkmark icons)',
        }),
      ],
    }),

    // Position Details
    defineField({
      name: 'positionDetails',
      title: 'Position Details',
      type: 'object',
      fields: [
        defineField({
          name: 'jobTitle',
          title: 'Job Title',
          type: 'string',
          initialValue: 'Reservations Consultant',
        }),
        defineField({
          name: 'jobDescription',
          title: 'Job Description',
          type: 'text',
          rows: 6,
          initialValue: 'Consultants are predominately advising travel agents and the general public about our products and making reservations. Good writing skills and attention to detail are required when compiling quotes and itineraries for clients. Our team environment allows you plenty of opportunity to expand your marketing, product sourcing and airline ticketing (Galileo) skills. Experience in client management and general office skills, such as answering phones and using Microsoft Office is required. If you love Africa and have the drive and passion to inspire others to experience it too, then we would like to hear from you.',
        }),
      ],
    }),

    // Requirements Section (6 checkmark requirements)
    defineField({
      name: 'requirements',
      title: 'Job Requirements',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'The successful candidate must have:',
        }),
        defineField({
          name: 'requirements',
          title: 'Requirements List',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'requirement',
              fields: [
                {
                  name: 'text',
                  title: 'Requirement Text',
                  type: 'text',
                  rows: 2,
                },
                {
                  name: 'isHighlighted',
                  title: 'Highlight this requirement?',
                  type: 'boolean',
                  description: 'Makes the text bold (e.g., "Travelled to Africa")',
                  initialValue: false,
                },
              ],
            },
          ],
          validation: (Rule) => Rule.max(6),
          description: 'Job requirements with checkmark icons',
        }),
      ],
    }),

    // Benefits Grid (Package & Hours)
    defineField({
      name: 'benefitsGrid',
      title: 'Benefits Grid',
      type: 'object',
      fields: [
        defineField({
          name: 'packageSection',
          title: 'Package Benefits',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Package',
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'dollar-sign',
              description: 'Lucide icon name (e.g., dollar-sign, calendar, briefcase)',
            },
            {
              name: 'benefits',
              title: 'Package Benefits',
              type: 'array',
              of: [{type: 'string', name: 'benefit'}],
              validation: (Rule) => Rule.max(5),
            },
          ],
        }),
        defineField({
          name: 'hoursSection',
          title: 'Working Hours',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Hours',
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'calendar',
              description: 'Lucide icon name (e.g., calendar, clock, schedule)',
            },
            {
              name: 'schedule',
              title: 'Work Schedule',
              type: 'array',
              of: [{type: 'string', name: 'scheduleItem'}],
              validation: (Rule) => Rule.max(5),
            },
          ],
        }),
      ],
    }),

    // Career Development & Culture (2 columns)
    defineField({
      name: 'developmentCulture',
      title: 'Career Development & Culture',
      type: 'object',
      fields: [
        defineField({
          name: 'careerDevelopment',
          title: 'Career Development',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Career Development',
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'graduation-cap',
              description: 'Lucide icon name (e.g., graduation-cap, book, award)',
            },
            {
              name: 'points',
              title: 'Development Points',
              type: 'array',
              of: [{type: 'string', name: 'developmentPoint'}],
              validation: (Rule) => Rule.max(6),
            },
          ],
        }),
        defineField({
          name: 'teamCulture',
          title: 'Team & Culture',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Team & Culture',
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'heart',
              description: 'Lucide icon name (e.g., heart, users, smile)',
            },
            {
              name: 'points',
              title: 'Culture Points',
              type: 'array',
              of: [{type: 'string', name: 'culturePoint'}],
              validation: (Rule) => Rule.max(6),
            },
          ],
        }),
      ],
    }),

    // Office Location
    defineField({
      name: 'officeLocation',
      title: 'Office Location',
      type: 'object',
      fields: [
        defineField({
          name: 'locationText',
          title: 'Location Description',
          type: 'string',
          initialValue: 'Randwick, NSW - Close to public transport links',
        }),
      ],
    }),

    // Application CTA
    defineField({
      name: 'applicationCta',
      title: 'Application Call-to-Action',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'CTA Title',
          type: 'string',
          initialValue: 'Start Your African Travel Career',
        }),
        defineField({
          name: 'subtitle',
          title: 'CTA Subtitle',
          type: 'string',
          initialValue: 'Join the leading specialists in African adventure travel',
        }),
        defineField({
          name: 'description',
          title: 'CTA Description',
          type: 'text',
          rows: 3,
          initialValue: 'Take the next step in your travel career by joining our passionate team. Send us your resume, covering letter, and a list of African countries you\'ve experienced firsthand.',
        }),
        defineField({
          name: 'emailAddress',
          title: 'Application Email',
          type: 'string',
          initialValue: 'employment@thisisafrica.com.au',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Apply Now',
        }),
      ],
    }),

    // Why Work With Us Section (3 feature cards)
    defineField({
      name: 'whyWorkWithUs',
      title: 'Why Work With Us Section',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Work at This is Africa?',
        }),
        defineField({
          name: 'features',
          title: 'Feature Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'featureCard',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon Name',
                  type: 'string',
                  description: 'Lucide icon name (e.g., briefcase, map-pin, calendar, globe)',
                },
                {
                  name: 'title',
                  title: 'Feature Title',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Feature Description',
                  type: 'text',
                  rows: 2,
                },
              ],
            },
          ],
          validation: (Rule) => Rule.max(3),
          description: 'Maximum 3 feature cards for the bottom section',
        }),
      ],
    }),

    // SEO Settings
    defineField({
      name: 'seoSettings',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          initialValue: 'Employment Opportunities - This is Africa',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          initialValue: 'Join our passionate team of African travel specialists. We\'re seeking experienced travel consultants to help create unforgettable African adventures.',
        }),
        defineField({
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroSection.primarySubtitle',
      media: 'heroSection.heroImage',
    },
  },
})