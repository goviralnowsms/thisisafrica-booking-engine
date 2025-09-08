import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Contact Us',
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
      description: 'URL path for this page (e.g., /contact)',
    }),

    // Header Section
    defineField({
      name: 'headerSection',
      title: 'Page Header',
      type: 'object',
      fields: [
        defineField({
          name: 'mainTitle',
          title: 'Main Title',
          type: 'string',
          initialValue: 'Get a Quote',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'Tell us about your dream African adventure',
        }),
        defineField({
          name: 'backLinkText',
          title: 'Back Link Text',
          type: 'string',
          initialValue: 'Browse Tours',
          description: 'Text for the back navigation link',
        }),
        defineField({
          name: 'backLinkUrl',
          title: 'Back Link URL',
          type: 'string',
          initialValue: '/booking',
          description: 'URL for the back navigation link',
        }),
      ],
    }),

    // Form Configuration
    defineField({
      name: 'contactForm',
      title: 'Contact Form Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'nameFieldLabel',
          title: 'Name Field Label',
          type: 'string',
          initialValue: 'Full Name',
        }),
        defineField({
          name: 'namePlaceholder',
          title: 'Name Placeholder',
          type: 'string',
          initialValue: 'Your full name',
        }),
        defineField({
          name: 'emailFieldLabel',
          title: 'Email Field Label',
          type: 'string',
          initialValue: 'Email Address',
        }),
        defineField({
          name: 'emailPlaceholder',
          title: 'Email Placeholder',
          type: 'string',
          initialValue: 'your@email.com',
        }),
        defineField({
          name: 'phoneFieldLabel',
          title: 'Phone Field Label',
          type: 'string',
          initialValue: 'Phone Number',
        }),
        defineField({
          name: 'phonePlaceholder',
          title: 'Phone Placeholder',
          type: 'string',
          initialValue: '+61 XXX XXX XXX',
        }),
        defineField({
          name: 'travelersFieldLabel',
          title: 'Travelers Field Label',
          type: 'string',
          initialValue: 'Number of Travelers',
        }),
        defineField({
          name: 'dateFieldLabel',
          title: 'Date Field Label',
          type: 'string',
          initialValue: 'Preferred Travel Date',
        }),
        defineField({
          name: 'messageFieldLabel',
          title: 'Message Field Label',
          type: 'string',
          initialValue: 'Message',
        }),
        defineField({
          name: 'messagePlaceholder',
          title: 'Message Placeholder',
          type: 'text',
          rows: 3,
          initialValue: 'Tell us about your dream African adventure. Include any special requirements, preferences, or questions you have.',
        }),
        defineField({
          name: 'submitButtonText',
          title: 'Submit Button Text',
          type: 'string',
          initialValue: 'Send Quote Request',
        }),
        defineField({
          name: 'submittingText',
          title: 'Submitting Text',
          type: 'string',
          initialValue: 'Sending...',
        }),
        defineField({
          name: 'termsText',
          title: 'Terms Agreement Text',
          type: 'text',
          rows: 2,
          initialValue: 'I agree with Terms & Conditions and Privacy Policy',
        }),
      ],
    }),

    // Contact Information
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Contact Information',
        }),
        defineField({
          name: 'phoneSection',
          title: 'Phone Section',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'phone',
              description: 'Lucide icon name (e.g., phone, smartphone)',
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: 'Phone',
            },
            {
              name: 'number',
              title: 'Phone Number',
              type: 'string',
              initialValue: '+61 2 9664 9187',
            },
            {
              name: 'hours',
              title: 'Business Hours',
              type: 'string',
              initialValue: 'Mon-Fri: 9:00am-5:00pm | Sat: by appointment',
            },
          ],
        }),
        defineField({
          name: 'emailSection',
          title: 'Email Section',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'mail',
              description: 'Lucide icon name (e.g., mail, at-sign)',
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: 'Email',
            },
            {
              name: 'address',
              title: 'Email Address',
              type: 'string',
              initialValue: 'sales@thisisafrica.com.au',
            },
            {
              name: 'responseTime',
              title: 'Response Time',
              type: 'string',
              initialValue: 'We respond within 24 hours Mon-Fri',
            },
          ],
        }),
        defineField({
          name: 'officeSection',
          title: 'Office Section',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              initialValue: 'map-pin',
              description: 'Lucide icon name (e.g., map-pin, building)',
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              initialValue: 'Office',
            },
            {
              name: 'address',
              title: 'Office Address',
              type: 'text',
              rows: 2,
              initialValue: '51 Frenchmans Rd\nRandwick NSW 2031',
            },
          ],
        }),
      ],
    }),

    // Why Get a Quote Section
    defineField({
      name: 'whyQuoteSection',
      title: 'Why Get a Quote Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Get a Quote?',
        }),
        defineField({
          name: 'benefits',
          title: 'Quote Benefits',
          type: 'array',
          of: [{type: 'string'}],
          initialValue: [
            'Personalized itinerary recommendations',
            'Best available pricing and deals',
            'Expert advice from Africa specialists',
            'Flexible payment options'
          ],
          validation: (Rule) => Rule.max(6),
          description: 'Benefits of getting a quote (displayed with bullet points)',
        }),
      ],
    }),

    // Success Page Configuration
    defineField({
      name: 'successPage',
      title: 'Success Page Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'successIcon',
          title: 'Success Icon',
          type: 'string',
          initialValue: 'send',
          description: 'Lucide icon name for success state',
        }),
        defineField({
          name: 'successTitle',
          title: 'Success Title',
          type: 'string',
          initialValue: 'Message Sent Successfully!',
        }),
        defineField({
          name: 'successMessage',
          title: 'Success Message',
          type: 'text',
          rows: 3,
          initialValue: 'Thank you for your inquiry. Our travel experts will review your request and get back to you within 24 hours with a personalized quote.',
        }),
        defineField({
          name: 'nextStepsTitle',
          title: 'Next Steps Title',
          type: 'string',
          initialValue: 'What happens next?',
        }),
        defineField({
          name: 'nextSteps',
          title: 'Next Steps List',
          type: 'array',
          of: [{type: 'string'}],
          initialValue: [
            'Our team will review your requirements',
            'We\'ll check availability for your preferred dates',
            'You\'ll receive a detailed quote within 24 hours',
            'We\'ll follow up to discuss your perfect African adventure'
          ],
          validation: (Rule) => Rule.max(6),
          description: 'Steps that happen after form submission',
        }),
        defineField({
          name: 'primaryButtonText',
          title: 'Primary Button Text',
          type: 'string',
          initialValue: 'Return Home',
        }),
        defineField({
          name: 'primaryButtonUrl',
          title: 'Primary Button URL',
          type: 'string',
          initialValue: '/',
        }),
        defineField({
          name: 'secondaryButtonText',
          title: 'Secondary Button Text',
          type: 'string',
          initialValue: 'Browse More Tours',
        }),
        defineField({
          name: 'secondaryButtonUrl',
          title: 'Secondary Button URL',
          type: 'string',
          initialValue: '/booking',
        }),
      ],
    }),

    // Form Behavior Settings
    defineField({
      name: 'formSettings',
      title: 'Form Behavior Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'enableTourPreFill',
          title: 'Enable Tour Pre-fill',
          type: 'boolean',
          initialValue: true,
          description: 'Allow form to be pre-filled from tour parameter in URL',
        }),
        defineField({
          name: 'enableBrochureRequest',
          title: 'Enable Brochure Request',
          type: 'boolean',
          initialValue: true,
          description: 'Allow form to be pre-filled for brochure requests',
        }),
        defineField({
          name: 'brochureRequestMessage',
          title: 'Brochure Request Default Message',
          type: 'text',
          rows: 3,
          initialValue: 'Please send me a printed brochure.\n\nI would like to receive your latest travel brochure with details of all your African tours and packages.',
        }),
        defineField({
          name: 'tourRequestTemplate',
          title: 'Tour Request Message Template',
          type: 'text',
          rows: 2,
          initialValue: 'I am interested in getting a quote for the tour: {TOUR_NAME}\n\nPlease provide pricing and availability details.',
          description: 'Template for tour-specific requests. Use {TOUR_NAME} as placeholder',
        }),
        defineField({
          name: 'recipientEmail',
          title: 'Form Recipient Email',
          type: 'string',
          initialValue: 'sales@thisisafrica.com.au',
          description: 'Email address to receive form submissions',
        }),
        defineField({
          name: 'requireTermsAgreement',
          title: 'Require Terms Agreement',
          type: 'boolean',
          initialValue: true,
          description: 'Require users to agree to terms and privacy policy',
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
          initialValue: 'Contact Us - This is Africa Travel',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          initialValue: 'Get a personalized quote for your African adventure. Contact our travel experts for customized itineraries, pricing, and expert advice.',
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
      subtitle: 'headerSection.subtitle',
    },
  },
})