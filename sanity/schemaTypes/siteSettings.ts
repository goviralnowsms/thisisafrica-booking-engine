import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The main title of your website',
      initialValue: 'This Is Africa',
    }),
    
    // Header Settings
    defineField({
      name: 'header',
      title: 'Header Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'phone',
          title: 'Header Phone Number',
          type: 'string',
          description: 'Phone number displayed in header',
          initialValue: '+61 2 9664 9187',
        }),
        defineField({
          name: 'email',
          title: 'Header Email',
          type: 'string',
          description: 'Email address displayed in header',
          initialValue: 'sales@thisisafrica.com.au',
        }),
        defineField({
          name: 'officeHours',
          title: 'Office Hours',
          type: 'string',
          description: 'Office hours text displayed in header',
          initialValue: 'Mon-Fri: 9:00am-5:00pm AEST',
        }),
        defineField({
          name: 'tagline',
          title: 'Header Tagline',
          type: 'string',
          description: 'Tagline or slogan displayed in header',
          initialValue: 'African Travel Specialists Since 1999',
        }),
        defineField({
          name: 'showContactInfo',
          title: 'Show Contact Info in Header',
          type: 'boolean',
          description: 'Display phone and email in header',
          initialValue: true,
        }),
      ],
    }),

    // Footer Settings
    defineField({
      name: 'footer',
      title: 'Footer Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
          initialValue: 'This Is Africa Pty Ltd',
        }),
        defineField({
          name: 'abn',
          title: 'ABN Number',
          type: 'string',
          description: 'Australian Business Number',
          initialValue: 'ABN 32 606 195 895',
        }),
        defineField({
          name: 'licenseNumber',
          title: 'Travel License Number',
          type: 'string',
          description: 'Travel license number',
          initialValue: 'LTA 5865',
        }),
        defineField({
          name: 'address',
          title: 'Business Address',
          type: 'object',
          fields: [
            { name: 'street', type: 'string', title: 'Street Address', initialValue: '51 Frenchmans Rd' },
            { name: 'suburb', type: 'string', title: 'Suburb', initialValue: 'Randwick' },
            { name: 'state', type: 'string', title: 'State', initialValue: 'NSW' },
            { name: 'postcode', type: 'string', title: 'Postcode', initialValue: '2031' },
            { name: 'country', type: 'string', title: 'Country', initialValue: 'Australia' },
          ],
        }),
        defineField({
          name: 'phone',
          title: 'Footer Phone Number',
          type: 'string',
          description: 'Phone number displayed in footer',
          initialValue: '+61 2 9664 9187',
        }),
        defineField({
          name: 'email',
          title: 'Footer Email',
          type: 'string',
          description: 'Email address displayed in footer',
          initialValue: 'sales@thisisafrica.com.au',
        }),
        defineField({
          name: 'officeHours',
          title: 'Office Hours',
          type: 'text',
          rows: 3,
          description: 'Office hours displayed in footer',
          initialValue: 'Monday - Friday: 9:00am - 5:00pm AEST\nSaturday: By appointment only\nSunday: Closed',
        }),
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Copyright notice in footer',
          initialValue: '© 2025 This Is Africa Pty Ltd. All rights reserved.',
        }),
        defineField({
          name: 'description',
          title: 'Company Description',
          type: 'text',
          rows: 3,
          description: 'Brief company description for footer',
          initialValue: 'Your trusted African travel specialists since 1999. We create unforgettable safari experiences across Africa with personalized service and expert local knowledge.',
        }),
      ],
    }),

    // Contact Information
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'mainPhone',
          title: 'Main Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
          description: 'Primary business phone number',
          initialValue: '+61 2 9664 9187',
        }),
        defineField({
          name: 'salesEmail',
          title: 'Sales Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
          description: 'Main sales email address',
          initialValue: 'sales@thisisafrica.com.au',
        }),
        defineField({
          name: 'supportEmail',
          title: 'Support Email',
          type: 'string',
          description: 'Customer support email address',
          initialValue: 'support@thisisafrica.com.au',
        }),
        defineField({
          name: 'emergencyPhone',
          title: 'Emergency Phone',
          type: 'string',
          description: '24/7 emergency contact number',
          initialValue: '+61 404 XXX XXX',
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'WhatsApp contact number',
          initialValue: '+61 2 9664 9187',
        }),
      ],
    }),

    // Social Media
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Facebook page URL',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Instagram profile URL',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
          description: 'Twitter profile URL',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          description: 'YouTube channel URL',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
          description: 'LinkedIn company page URL',
        }),
      ],
    }),

    // SEO Settings
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          description: 'Default page title for SEO',
          initialValue: 'This Is Africa | African Safari Specialists Since 1999',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
          description: 'Default meta description for SEO',
          initialValue: 'Plan your perfect African safari with This Is Africa. Expert travel specialists offering tailor-made safaris, group tours, and luxury experiences across Africa since 1999.',
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          description: 'SEO keywords for your website',
        }),
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Google Analytics tracking ID (e.g., GA4-XXXXXXXXX)',
        }),
        defineField({
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'Google Tag Manager container ID (e.g., GTM-XXXXXXX)',
        }),
      ],
    }),

    // Business Information
    defineField({
      name: 'business',
      title: 'Business Information',
      type: 'object',
      fields: [
        defineField({
          name: 'establishedYear',
          title: 'Established Year',
          type: 'number',
          description: 'Year the business was established',
          initialValue: 1999,
        }),
        defineField({
          name: 'specialties',
          title: 'Business Specialties',
          type: 'array',
          of: [{type: 'string'}],
          description: 'What your business specializes in',
          initialValue: ['African Safaris', 'Group Tours', 'Luxury Travel', 'Tailor-Made Tours'],
        }),
        defineField({
          name: 'certifications',
          title: 'Certifications & Memberships',
          type: 'array',
          of: [{type: 'string'}],
          description: 'Industry certifications and memberships',
          initialValue: ['Licensed Travel Agent (LTA 5865)', 'AFTA Member'],
        }),
      ],
    }),

    // Emergency & Important Info
    defineField({
      name: 'emergency',
      title: 'Emergency Information',
      type: 'object',
      fields: [
        defineField({
          name: 'afterHoursContact',
          title: 'After Hours Contact',
          type: 'string',
          description: 'After hours emergency contact information',
          initialValue: 'For travel emergencies, contact your travel insurance provider',
        }),
        defineField({
          name: 'importantNotice',
          title: 'Important Notice',
          type: 'text',
          rows: 3,
          description: 'Important notice or announcement to display',
        }),
        defineField({
          name: 'showImportantNotice',
          title: 'Show Important Notice',
          type: 'boolean',
          description: 'Display the important notice on the website',
          initialValue: false,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'header.tagline',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Configure your website settings',
      }
    },
  },
})