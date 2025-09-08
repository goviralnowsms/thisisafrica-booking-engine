import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'staticPage',
  title: 'Static Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      description: 'URL path for this page (e.g., /privacy-policy)',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          {title: 'Terms & Conditions', value: 'terms'},
          {title: 'Privacy Policy', value: 'privacy'},
          {title: 'FAQ', value: 'faq'},
          {title: 'Travel Information', value: 'travel-info'},
          {title: 'Booking Terms', value: 'booking-terms'},
          {title: 'Travel Insurance', value: 'travel-insurance'},
          {title: 'Visa Information', value: 'visa-info'},
          {title: 'Health & Safety', value: 'health-safety'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'Select the type of static page',
    }),
    
    // Hero/Header Section
    defineField({
      name: 'headerSection',
      title: 'Page Header',
      type: 'object',
      fields: [
        defineField({
          name: 'showHeader',
          title: 'Show Page Header',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'headerStyle',
          title: 'Header Style',
          type: 'string',
          options: {
            list: [
              {title: 'Simple Header (text only)', value: 'simple'},
              {title: 'Hero Header (with background)', value: 'hero'},
            ],
          },
          initialValue: 'simple',
        }),
        defineField({
          name: 'headline',
          title: 'Main Headline',
          type: 'string',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
        }),
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
          hidden: ({parent}) => parent?.headerStyle !== 'hero',
        }),
        defineField({
          name: 'lastUpdated',
          title: 'Last Updated Text',
          type: 'string',
          description: 'e.g., "Last updated: January 2025"',
        }),
      ],
    }),

    // Main Content
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        // Rich text blocks
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
            ],
          },
        },
        // Images
        {
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
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        // FAQ Accordion
        {
          name: 'accordion',
          type: 'object',
          title: 'FAQ Accordion',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Frequently Asked Questions',
            },
            {
              name: 'items',
              title: 'FAQ Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'question', type: 'string', title: 'Question'},
                    {name: 'answer', type: 'array', title: 'Answer', of: [{type: 'block'}]},
                  ],
                  preview: {
                    select: {
                      title: 'question',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Info Box
        {
          name: 'infoBox',
          type: 'object',
          title: 'Information Box',
          fields: [
            {
              name: 'style',
              title: 'Box Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Info (Blue)', value: 'info'},
                  {title: 'Warning (Amber)', value: 'warning'},
                  {title: 'Success (Green)', value: 'success'},
                  {title: 'Error (Red)', value: 'error'},
                ],
              },
              initialValue: 'info',
            },
            {
              name: 'title',
              title: 'Box Title',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Box Content',
              type: 'array',
              of: [{type: 'block'}],
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Lucide icon name (e.g., info, alert-triangle, check-circle)',
            },
          ],
        },
        // Table
        {
          name: 'table',
          type: 'object',
          title: 'Table',
          fields: [
            {
              name: 'title',
              title: 'Table Title',
              type: 'string',
            },
            {
              name: 'headers',
              title: 'Table Headers',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'rows',
              title: 'Table Rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      title: 'Row Cells',
                      type: 'array',
                      of: [{type: 'string'}],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Contact Information
        {
          name: 'contactInfo',
          type: 'object',
          title: 'Contact Information Block',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Need Help?',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'showPhone',
              title: 'Show Phone',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'showEmail',
              title: 'Show Email',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'customContactText',
              title: 'Custom Contact Text',
              type: 'text',
              rows: 2,
              description: 'Override default contact information with custom text',
            },
          ],
        },
      ],
    }),

    // Sidebar Content (optional)
    defineField({
      name: 'sidebar',
      title: 'Sidebar Content',
      type: 'object',
      fields: [
        defineField({
          name: 'showSidebar',
          title: 'Show Sidebar',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'sidebarTitle',
          title: 'Sidebar Title',
          type: 'string',
        }),
        defineField({
          name: 'sidebarContent',
          title: 'Sidebar Content',
          type: 'array',
          of: [
            {type: 'block'},
            {
              name: 'quickLinks',
              type: 'object',
              title: 'Quick Links',
              fields: [
                {
                  name: 'title',
                  title: 'Links Section Title',
                  type: 'string',
                  initialValue: 'Quick Links',
                },
                {
                  name: 'links',
                  title: 'Links',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {name: 'text', type: 'string', title: 'Link Text'},
                        {name: 'url', type: 'string', title: 'URL'},
                        {name: 'openInNewTab', type: 'boolean', title: 'Open in new tab', initialValue: false},
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),

    // Page-specific settings
    defineField({
      name: 'pageSettings',
      title: 'Page Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'showBreadcrumbs',
          title: 'Show Breadcrumbs',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showTableOfContents',
          title: 'Show Table of Contents',
          type: 'boolean',
          initialValue: false,
          description: 'Auto-generate table of contents from headings',
        }),
        defineField({
          name: 'allowPrint',
          title: 'Allow Printing',
          type: 'boolean',
          initialValue: true,
          description: 'Show print button for this page',
        }),
        defineField({
          name: 'showLastUpdated',
          title: 'Show Last Updated Date',
          type: 'boolean',
          initialValue: true,
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
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false,
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'string',
          description: 'Override the canonical URL for this page',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
      media: 'headerSection.heroImage',
    },
    prepare({title, subtitle, media}) {
      const pageTypeLabels = {
        'terms': 'Terms & Conditions',
        'privacy': 'Privacy Policy',
        'faq': 'FAQ',
        'travel-info': 'Travel Information',
        'booking-terms': 'Booking Terms',
        'travel-insurance': 'Travel Insurance',
        'visa-info': 'Visa Information',
        'health-safety': 'Health & Safety',
        'other': 'Other',
      }
      return {
        title,
        subtitle: pageTypeLabels[subtitle as keyof typeof pageTypeLabels] || subtitle,
        media,
      }
    },
  },
})