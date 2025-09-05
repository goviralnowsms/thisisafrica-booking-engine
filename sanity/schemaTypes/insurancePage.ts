import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'insurancePage',
  title: 'Insurance Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 2,
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
        defineField({
          name: 'ctaBox',
          title: 'CTA Box',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name (e.g., shield, umbrella, heart-handshake)',
            }),
            defineField({
              name: 'title',
              title: 'CTA Title',
              type: 'string',
            }),
            defineField({
              name: 'subtitle',
              title: 'CTA Subtitle',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contentSection',
      title: 'Content Section',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'checkmarkSection',
      title: 'Check Mark Icons Section (4 items)',
      type: 'array',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Check Mark Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'text',
            },
            prepare({title}) {
              return {
                title: `✓ ${title}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'middleParagraph',
      title: 'Middle Paragraph Section',
      type: 'text',
      rows: 4,
      description: 'Paragraph section between checkmarks and emergency support',
    }),
    defineField({
      name: 'emergencySupport',
      title: '24/7 Emergency Medical Support',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: '24/7 Emergency Medical Support',
        }),
        defineField({
          name: 'icon',
          title: 'Section Icon',
          type: 'string',
          description: 'Icon name (e.g., phone, headphones, medical-services)',
        }),
        defineField({
          name: 'paragraph',
          title: 'Paragraph',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'supportItems',
          title: 'Support Items (3 items)',
          type: 'array',
          validation: (Rule) => Rule.max(3),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  description: 'Icon name (e.g., clock, globe, shield)',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'subtitle',
                  title: 'Subtitle',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'subtitle',
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'getQuoteSection',
      title: 'Get Your Quote Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
        }),
        defineField({
          name: 'points',
          title: 'Quote Points (2 points)',
          type: 'array',
          validation: (Rule) => Rule.max(2),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Point Number',
                  type: 'string',
                  initialValue: '1',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'text',
                  title: 'Point Text',
                  type: 'text',
                  rows: 2,
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'number',
                  subtitle: 'text',
                },
                prepare({title, subtitle}) {
                  return {
                    title: `Point ${title}`,
                    subtitle,
                  }
                },
              },
            },
          ],
        }),
        defineField({
          name: 'logo',
          title: 'Logo/Image',
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
      name: 'importantInformation',
      title: 'Important Information Section',
      type: 'object',
      fields: [
        defineField({
          name: 'icon',
          title: 'Section Icon',
          type: 'string',
          description: 'Icon name (e.g., info, alert-circle, file-text)',
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{type: 'block'}],
        }),
      ],
    }),
    defineField({
      name: 'bottomCta',
      title: 'Bottom CTA Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'CTA Title',
          type: 'string',
        }),
        defineField({
          name: 'subtitle',
          title: 'CTA Subtitle',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Button Text'},
            {name: 'link', type: 'string', title: 'Button Link'},
          ],
        }),
        defineField({
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Button Text'},
            {name: 'link', type: 'string', title: 'Button Link'},
          ],
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroSection.heroImage',
    },
  },
})