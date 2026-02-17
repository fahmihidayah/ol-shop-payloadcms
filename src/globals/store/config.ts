import { GlobalConfig } from 'payload'

export const StoreConfig: GlobalConfig = {
  slug: 'store-config',
  admin: {
    group: 'Store',
    description: 'Master configuration for branding, localization, and SEO.',
  },
  access: {
    read: () => true, // Frontend needs to read these settings
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Store Identity',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'storeName', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'storeOwner', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'logo', type: 'upload', relationTo: 'media', required: true },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            { name: 'storeDescription', type: 'richText' },
          ],
        },
        {
          label: 'Localisation',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultCurrency',
                  type: 'select',
                  defaultValue: 'IDR',
                  options: [
                    { label: 'Rupiah (IDR)', value: 'IDR' },
                    { label: 'US Dollar (USD)', value: 'USD' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'currencySymbol',
                  type: 'text',
                  defaultValue: 'Rp',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'weightClass',
                  type: 'select',
                  defaultValue: 'kg',
                  options: [
                    { label: 'Kilogram (kg)', value: 'kg' },
                    { label: 'Gram (g)', value: 'g' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'lengthClass',
                  type: 'select',
                  defaultValue: 'cm',
                  options: [
                    { label: 'Centimeter (cm)', value: 'cm' },
                    { label: 'Millimeter (mm)', value: 'mm' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultShippingCost',
                  type: 'number',
                  defaultValue: 10000,
                  admin: { width: '50%', description: 'Flat rate for shipping' },
                },
                {
                  name: 'freeShippingThreshold',
                  type: 'number',
                  admin: { width: '50%', description: 'Minimum spend for free shipping' },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & Social',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                { name: 'phone', type: 'text', admin: { width: '50%', placeholder: '+62...' } },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
            },
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Social Link', plural: 'Social Links' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      options: ['Instagram', 'WhatsApp', 'Facebook', 'TikTok', 'Twitter'],
                      admin: { width: '40%' },
                    },
                    { name: 'url', type: 'text', admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: { description: 'The title used by search engines.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: { description: 'The summary used by search engines.' },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Image shown when sharing the site on social media.' },
            },
          ],
        },
      ],
    },
  ],
}
