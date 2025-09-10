import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productImage',
  title: 'Product Image',
  type: 'document',
  fields: [
    defineField({
      name: 'productCode',
      title: 'Product Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'TourPlan product code (e.g., NBOGTARP001CKSE)',
    }),
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      description: 'Friendly name for reference (e.g., Classic Kenya - Serena lodges)',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          {title: 'Day Tour', value: 'day-tour'},
          {title: 'Group Tour', value: 'group-tour'},
          {title: 'Accommodation', value: 'accommodation'},
          {title: 'Cruise', value: 'cruise'},
          {title: 'Rail', value: 'rail'},
          {title: 'Package', value: 'package'},
        ],
      },
    }),
    defineField({
      name: 'primaryImage',
      title: 'Primary Image',
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
          validation: (Rule) => Rule.required(),
        },
      ],
      description: 'Main image shown in search results and product cards',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          title: 'Gallery Image',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
            },
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
            {
              name: 'order',
              type: 'number',
              title: 'Display Order',
              description: 'Order in gallery (lower numbers appear first)',
            },
          ],
          preview: {
            select: {
              title: 'alt',
              subtitle: 'caption',
              media: 'image',
            },
          },
        },
      ],
      description: 'Additional images for product detail page gallery',
    }),
    defineField({
      name: 'mapImage',
      title: 'Map/Route Image',
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
      description: 'Optional map or route image for tours',
    }),
    defineField({
      name: 'thumbnailImage',
      title: 'Thumbnail Image',
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
      description: 'Small thumbnail for quick loading (optional - will use primary if not set)',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this product currently active and bookable?',
      initialValue: true,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tag',
          fields: [
            {
              name: 'value',
              type: 'string',
              title: 'Tag',
            },
          ],
          preview: {
            select: {
              title: 'value',
            },
          },
        },
      ],
      options: {
        layout: 'tags',
      },
      description: 'Tags for categorization (e.g., luxury, budget, family-friendly)',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes about this product (not shown to customers)',
    }),
  ],
  preview: {
    select: {
      title: 'productCode',
      subtitle: 'productName',
      media: 'primaryImage',
    },
  },
})