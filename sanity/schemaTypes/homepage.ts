import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'string',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
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
          name: 'ctaButton',
          title: 'Call to Action Button',
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Button Text'},
            {name: 'link', type: 'string', title: 'Button Link'},
          ],
        }),
        defineField({
          name: 'videoButton',
          title: 'Watch Video Button',
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Button Text', initialValue: 'Watch Video'},
            {name: 'videoLink', type: 'url', title: 'Video Link', description: 'YouTube, Vimeo, or direct video URL'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'tourIntroText',
      title: 'Tour Introduction Text',
      type: 'text',
      rows: 3,
      description: 'Short paragraph that appears above the 6 tour cards',
    }),
    defineField({
      name: 'tourCards',
      title: 'Tour Cards (6 cards)',
      type: 'array',
      validation: (Rule) => Rule.max(6),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Card Image',
              type: 'image',
              validation: (Rule) => Rule.required(),
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
            },
            {
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'subtitle',
              title: 'Card Subtitle',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'buttonName',
              title: 'Button Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'URL where the button should link to',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              media: 'image',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products Section',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        }),
        defineField({
          name: 'sectionSubtitle',
          title: 'Section Subtitle',
          type: 'string',
        }),
        defineField({
          name: 'productCodes',
          title: 'Product Codes',
          type: 'array',
          of: [{type: 'string'}],
          description: 'TourPlan product codes to feature (e.g., NBOGTARP001CKSE)',
        }),
      ],
    }),
    defineField({
      name: 'featuredSafaris',
      title: 'Featured Safaris Section',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        }),
        defineField({
          name: 'sectionSubtitle',
          title: 'Section Subtitle',
          type: 'string',
        }),
        defineField({
          name: 'safariTours',
          title: 'Safari Tours (2 tours)',
          type: 'array',
          validation: (Rule) => Rule.max(2),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Tour Image',
                  type: 'image',
                  validation: (Rule) => Rule.required(),
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
                },
                {
                  name: 'title',
                  title: 'Tour Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'subtitle',
                  title: 'Tour Subtitle',
                  type: 'string',
                },
                {
                  name: 'viewMoreButton',
                  title: 'View More Button',
                  type: 'object',
                  fields: [
                    {name: 'text', type: 'string', title: 'Button Text', initialValue: 'View More'},
                    {name: 'link', type: 'string', title: 'Button Link'},
                  ],
                },
                {
                  name: 'bookNowButton',
                  title: 'Book Now Button',
                  type: 'object',
                  fields: [
                    {name: 'text', type: 'string', title: 'Button Text', initialValue: 'Book Now'},
                    {name: 'link', type: 'string', title: 'Button Link'},
                  ],
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'subtitle',
                  media: 'image',
                },
              },
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
              description: 'Icon name (e.g., search, map, compass, etc.)',
              initialValue: 'search',
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
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Button Link',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'aboutSection',
      title: 'About Section (3 columns)',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        }),
        defineField({
          name: 'columns',
          title: 'About Columns (3 columns)',
          type: 'array',
          validation: (Rule) => Rule.max(3),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'icon',
                  title: 'Column Icon',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                  description: 'Icon name (e.g., shield, users, globe, heart, star, etc.)',
                },
                {
                  name: 'title',
                  title: 'Column Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'subtitle',
                  title: 'Column Subtitle',
                  type: 'text',
                  rows: 3,
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'subtitle',
                  media: 'icon',
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonialsSection',
      title: 'Testimonials Section',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        }),
        defineField({
          name: 'sectionSubtitle',
          title: 'Section Subtitle',
          type: 'string',
        }),
        defineField({
          name: 'displayCount',
          title: 'Number of Testimonials to Display',
          type: 'number',
          initialValue: 3,
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
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroSection.backgroundImage',
    },
  },
})