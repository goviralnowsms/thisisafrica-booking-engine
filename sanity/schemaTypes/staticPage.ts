import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'staticPage',
  title: 'Static Page',
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
          {title: 'Contact', value: 'contact'},
          {title: 'FAQ', value: 'faq'},
          {title: 'Travel Information', value: 'travel-info'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'showHero',
          title: 'Show Hero Section',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
        }),
        defineField({
          name: 'heroImage',
          title: 'Hero Image',
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
      ],
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
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
        {
          name: 'accordion',
          type: 'object',
          title: 'FAQ Accordion',
          fields: [
            {
              name: 'items',
              title: 'FAQ Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'question', type: 'string', title: 'Question'},
                    {name: 'answer', type: 'text', title: 'Answer', rows: 3},
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'contactForm',
          type: 'object',
          title: 'Contact Form',
          fields: [
            {
              name: 'showForm',
              type: 'boolean',
              title: 'Show Contact Form',
              initialValue: true,
            },
            {
              name: 'recipientEmail',
              type: 'string',
              title: 'Recipient Email',
            },
          ],
        },
      ],
    }),
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
          name: 'content',
          title: 'Sidebar Content',
          type: 'array',
          of: [{type: 'block'}],
        }),
      ],
    }),
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
      media: 'heroSection.heroImage',
    },
  },
})