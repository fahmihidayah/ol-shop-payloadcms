import type { GlobalConfig } from 'payload'

export const HomeConfig: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    group: 'Content',
    description: 'Manage home page content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'textarea',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'primaryCTA',
                  type: 'group',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                    },
                    {
                      name: 'href',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // =====================
        // PROMOTIONAL BANNERS
        // =====================
        {
          label: 'Promotions',
          fields: [
            {
              name: 'promotions',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'text',
                },
                {
                  name: 'link',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // =====================
        // FEATURED PRODUCTS
        // =====================
        {
          label: 'Featured Products',
          fields: [
            {
              name: 'featuredProducts',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Featured Products',
                },
                {
                  name: 'selectionMode',
                  type: 'select',
                  defaultValue: 'auto',
                  options: [
                    { label: 'Automatic', value: 'auto' },
                    { label: 'Manual', value: 'manual' },
                  ],
                },
                {
                  name: 'products',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: {
                    condition: (_, siblingData) => siblingData?.selectionMode === 'manual',
                  },
                },
                {
                  name: 'limit',
                  type: 'number',
                  defaultValue: 8,
                  min: 4,
                  max: 20,
                },
              ],
            },
          ],
        },

        // =====================
        // NEW ARRIVALS
        // =====================
        {
          label: 'New Arrivals',
          fields: [
            {
              name: 'newArrivals',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'New Arrivals',
                },
                {
                  name: 'limit',
                  type: 'number',
                  defaultValue: 8,
                  min: 4,
                  max: 20,
                },
              ],
            },
          ],
        },

        // =====================
        // CATEGORIES
        // =====================
        {
          label: 'Categories Showcase',
          fields: [
            {
              name: 'categoriesShowcase',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Shop by Category',
                },
                {
                  name: 'categories',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                },
              ],
            },
          ],
        },

        // =====================
        // SEO
        // =====================
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  maxLength: 60,
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  maxLength: 160,
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
