export default {
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Product', value: 'product' },
          { title: 'Destination', value: 'destination' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Accommodation', value: 'accommodation' },
          { title: 'Activity', value: 'activity' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'product',
    },
    {
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
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category',
    },
    prepare(selection: any) {
      const { title, media, category } = selection;
      return {
        title: title,
        subtitle: category ? `Category: ${category}` : '',
        media: media,
      };
    },
  },
}