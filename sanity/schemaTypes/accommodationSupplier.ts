import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'accommodationSupplier',
  title: 'Accommodation Supplier',
  type: 'document',
  fields: [
    defineField({
      name: 'supplierName',
      title: 'Supplier/Hotel Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Hotel or lodge name (e.g., Portswood Hotel, Sabi Sabi Bush Lodge)',
    }),
    defineField({
      name: 'supplierCode',
      title: 'Supplier Code',
      type: 'string',
      description: 'TourPlan supplier code if available',
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
      description: 'Main image shown in search results for all rooms in this hotel',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'galleryImage',
          title: 'Gallery Image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
            defineField({
              name: 'order',
              type: 'number',
              title: 'Display Order',
              description: 'Order in gallery (lower numbers appear first)',
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              subtitle: 'caption',
              media: 'image',
            },
          },
        }),
      ],
      description: 'Additional images for hotel detail pages',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the hotel/lodge',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'country',
          type: 'string',
          title: 'Country',
        }),
        defineField({
          name: 'destination',
          type: 'string',
          title: 'Destination/City',
        }),
        defineField({
          name: 'address',
          type: 'string',
          title: 'Full Address',
        }),
        defineField({
          name: 'gps',
          type: 'object',
          title: 'GPS Coordinates',
          fields: [
            defineField({
              name: 'latitude',
              type: 'number',
              title: 'Latitude',
            }),
            defineField({
              name: 'longitude',
              type: 'number',
              title: 'Longitude',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'type',
      title: 'Accommodation Type',
      type: 'string',
      options: {
        list: [
          {title: 'Hotel', value: 'hotel'},
          {title: 'Lodge', value: 'lodge'},
          {title: 'Camp', value: 'camp'},
          {title: 'Resort', value: 'resort'},
          {title: 'Guest House', value: 'guesthouse'},
          {title: 'Villa', value: 'villa'},
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Category/Star Rating',
      type: 'string',
      options: {
        list: [
          {title: 'Ultra Luxury (5+ Star)', value: 'ultra-luxury'},
          {title: 'Luxury (5 Star)', value: 'luxury'},
          {title: 'Premium (4 Star)', value: 'premium'},
          {title: 'Standard (3 Star)', value: 'standard'},
          {title: 'Budget (2 Star)', value: 'budget'},
        ],
      },
    }),
    defineField({
      name: 'associatedProductCodes',
      title: 'Associated Product Codes',
      type: 'array',
      of: [defineField({type: 'string', name: 'productCode'})],
      description: 'TourPlan product codes for rooms in this hotel (e.g., CPTHTHTM001CPG8DD)',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [defineField({type: 'string', name: 'amenity'})],
      options: {
        layout: 'tags',
      },
      description: 'Hotel amenities (e.g., Pool, Spa, Restaurant, WiFi)',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this hotel currently active and bookable?',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Feature this hotel prominently?',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order for display (lower numbers appear first)',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes about this supplier (not shown to customers)',
    }),
  ],
  preview: {
    select: {
      title: 'supplierName',
      subtitle: 'location.destination',
      media: 'primaryImage',
    },
  },
})