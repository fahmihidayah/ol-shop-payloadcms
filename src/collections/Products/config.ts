import { CollectionConfig } from 'payload'
import getProductVariantArrayFields from './product-variants'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-populate defaultVariant and defaultVariantPrice based on lowest price variant
        if (data['product-variant'] && data['product-variant'].length > 0) {
          // Filter active variants
          const activeVariants = data['product-variant'].filter(
            (variant: any) => variant.isActive !== false,
          )

          if (activeVariants.length > 0) {
            // Find variant with lowest price
            const lowestPriceVariant = activeVariants.reduce((lowest: any, current: any) => {
              return current.price < lowest.price ? current : lowest
            })

            // Set default variant and price
            data.defaultVariant = lowestPriceVariant.id
            data.defaultVariantPrice = lowestPriceVariant.price
          } else {
            // No active variants, clear defaults
            data.defaultVariant = null
            data.defaultVariantPrice = null
          }
        } else {
          // No variants, clear defaults
          data.defaultVariant = null
          data.defaultVariantPrice = null
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => 'prod-' + crypto.randomUUID(),
      admin: {
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    ...slugField('name'),
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'defaultVariant',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'defaultVariantPrice',
      type: 'number',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Active',
          admin: {
            description: 'Publish this product on the storefront',
            width: '50%',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured Product',
          admin: {
            description: 'Show this product in featured sections',
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Variants',
          fields: [getProductVariantArrayFields()],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',

              label: 'Thumbnail Image',
              admin: {
                description: 'Main product image displayed in listings',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Product Gallery',
              admin: {
                description: 'Additional product images',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  label: 'Alt Text',
                  admin: {
                    description: 'Describe the image for accessibility and SEO',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: false,
              fields: [
                {
                  type: 'collapsible',
                  label: 'Meta Tags',
                  admin: {
                    initCollapsed: false,
                  },
                  fields: [
                    {
                      name: 'metaTitle',
                      type: 'text',
                      label: 'Meta Title',
                      admin: {
                        description:
                          'Override default title for SEO (50-60 characters recommended)',
                      },
                      maxLength: 60,
                    },
                    {
                      name: 'metaDescription',
                      type: 'textarea',
                      label: 'Meta Description',
                      admin: {
                        description:
                          'Meta description for search engines (150-160 characters recommended)',
                      },
                      maxLength: 160,
                    },
                    {
                      name: 'keywords',
                      type: 'array',
                      label: 'Focus Keywords',
                      admin: {
                        description: 'Keywords for internal search and categorization',
                      },
                      fields: [
                        {
                          name: 'keyword',
                          type: 'text',
                        },
                      ],
                    },
                    {
                      name: 'canonicalUrl',
                      type: 'text',
                      label: 'Canonical URL',
                      admin: {
                        description:
                          'Specify if this content exists elsewhere to avoid duplicate content issues',
                      },
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Open Graph (Social Sharing)',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'ogTitle',
                      type: 'text',
                      label: 'OG Title',
                      admin: {
                        description: 'Title when shared on social media (defaults to Meta Title)',
                      },
                    },
                    {
                      name: 'ogDescription',
                      type: 'textarea',
                      label: 'OG Description',
                      admin: {
                        description:
                          'Description when shared on social media (defaults to Meta Description)',
                      },
                    },
                    {
                      name: 'ogImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'OG Image',
                      admin: {
                        description: 'Image when shared on social media (1200x630px recommended)',
                      },
                    },
                    {
                      name: 'ogType',
                      type: 'select',
                      label: 'OG Type',
                      defaultValue: 'product',
                      options: [
                        { label: 'Product', value: 'product' },
                        { label: 'Article', value: 'article' },
                        { label: 'Website', value: 'website' },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Twitter Card',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'twitterCard',
                      type: 'select',
                      label: 'Card Type',
                      defaultValue: 'summary_large_image',
                      options: [
                        { label: 'Summary', value: 'summary' },
                        { label: 'Summary Large Image', value: 'summary_large_image' },
                        { label: 'Product', value: 'product' },
                      ],
                    },
                    {
                      name: 'twitterTitle',
                      type: 'text',
                      label: 'Twitter Title',
                      admin: {
                        description: 'Title for Twitter (defaults to OG Title or Meta Title)',
                      },
                    },
                    {
                      name: 'twitterDescription',
                      type: 'textarea',
                      label: 'Twitter Description',
                      admin: {
                        description:
                          'Description for Twitter (defaults to OG Description or Meta Description)',
                      },
                    },
                    {
                      name: 'twitterImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Twitter Image',
                      admin: {
                        description: 'Image for Twitter (defaults to OG Image)',
                      },
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Structured Data (Schema.org)',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'brand',
                      type: 'text',
                      label: 'Brand',
                      admin: {
                        description: 'Product brand name for structured data',
                      },
                    },
                    {
                      name: 'gtin',
                      type: 'text',
                      label: 'GTIN',
                      admin: {
                        description: 'Global Trade Item Number (UPC, EAN, ISBN)',
                      },
                    },
                    {
                      name: 'mpn',
                      type: 'text',
                      label: 'MPN',
                      admin: {
                        description: 'Manufacturer Part Number',
                      },
                    },
                    {
                      name: 'condition',
                      type: 'select',
                      label: 'Condition',
                      defaultValue: 'new',
                      options: [
                        { label: 'New', value: 'new' },
                        { label: 'Refurbished', value: 'refurbished' },
                        { label: 'Used', value: 'used' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
