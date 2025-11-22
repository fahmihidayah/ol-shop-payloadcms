import { GlobalConfig } from 'payload'

export const HomePageSettings: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    group: 'Content',
    description: 'Manage home page content and settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show Hero Section',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Hero Title',
                  required: true,
                  defaultValue: 'Welcome to Our Store',
                  admin: {
                    description: 'Main headline for the hero section',
                  },
                },
                {
                  name: 'subtitle',
                  type: 'textarea',
                  label: 'Hero Subtitle',
                  admin: {
                    description: 'Supporting text for the hero section',
                  },
                },
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                  admin: {
                    description: 'Hero background image (recommended: 1920x800px)',
                  },
                },
                {
                  name: 'ctaButtons',
                  type: 'array',
                  label: 'Call-to-Action Buttons',
                  maxRows: 2,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      label: 'Button Text',
                    },
                    {
                      name: 'link',
                      type: 'text',
                      required: true,
                      label: 'Button Link',
                      admin: {
                        description: 'URL or path (e.g., /products, /about)',
                      },
                    },
                    {
                      name: 'style',
                      type: 'select',
                      label: 'Button Style',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Banners & Promotions',
          fields: [
            {
              name: 'banners',
              type: 'array',
              label: 'Banner Slides',
              admin: {
                description: 'Rotating banners for promotions and campaigns',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Banner Image',
                  admin: {
                    description: 'Recommended size: 1920x600px',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Banner Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Banner Description',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link URL',
                  admin: {
                    description: 'Where should this banner link to?',
                  },
                },
                {
                  name: 'buttonText',
                  type: 'text',
                  label: 'Button Text',
                  admin: {
                    description: 'Leave empty to hide button',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Active',
                  defaultValue: true,
                  admin: {
                    description: 'Show/hide this banner',
                  },
                },
              ],
            },
            {
              name: 'promotionalBanners',
              type: 'array',
              label: 'Promotional Banners',
              maxRows: 3,
              admin: {
                description: 'Small promotional banners (e.g., free shipping, discounts)',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Icon',
                  admin: {
                    description: 'Small icon (64x64px recommended)',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Title',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Description',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link URL',
                },
              ],
            },
          ],
        },
        {
          label: 'Featured Sections',
          fields: [
            {
              name: 'featuredProducts',
              type: 'group',
              label: 'Featured Products',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show Featured Products',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Featured Products',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Section Subtitle',
                },
                {
                  name: 'displayType',
                  type: 'select',
                  label: 'Display Type',
                  defaultValue: 'auto',
                  options: [
                    {
                      label: 'Auto (Products marked as Featured)',
                      value: 'auto',
                    },
                    {
                      label: 'Manual Selection',
                      value: 'manual',
                    },
                  ],
                },
                {
                  name: 'products',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  label: 'Select Products',
                  admin: {
                    description: 'Only used when Display Type is Manual Selection',
                    condition: (_data, siblingData) => siblingData?.displayType === 'manual',
                  },
                },
                {
                  name: 'limit',
                  type: 'number',
                  label: 'Number of Products to Show',
                  defaultValue: 8,
                  min: 4,
                  max: 20,
                },
              ],
            },
            {
              name: 'newArrivals',
              type: 'group',
              label: 'New Arrivals',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show New Arrivals',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'New Arrivals',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Section Subtitle',
                },
                {
                  name: 'limit',
                  type: 'number',
                  label: 'Number of Products to Show',
                  defaultValue: 8,
                  min: 4,
                  max: 20,
                },
              ],
            },
            {
              name: 'categoriesShowcase',
              type: 'group',
              label: 'Categories Showcase',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show Categories Showcase',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Shop by Category',
                },
                {
                  name: 'categories',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                  label: 'Featured Categories',
                  admin: {
                    description: 'Select categories to highlight on home page',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Content Blocks',
          fields: [
            {
              name: 'contentBlocks',
              type: 'array',
              label: 'Custom Content Blocks',
              admin: {
                description: 'Add custom content sections to your home page',
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Block Type',
                  required: true,
                  options: [
                    { label: 'Text & Image', value: 'text-image' },
                    { label: 'Image Grid', value: 'image-grid' },
                    { label: 'Testimonials', value: 'testimonials' },
                    { label: 'Newsletter Signup', value: 'newsletter' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Block Title',
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Content',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                },
                {
                  name: 'layout',
                  type: 'select',
                  label: 'Layout',
                  defaultValue: 'left',
                  options: [
                    { label: 'Image Left', value: 'left' },
                    { label: 'Image Right', value: 'right' },
                    { label: 'Full Width', value: 'full' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.type === 'text-image',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Meta',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO Settings',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Title',
                  admin: {
                    description: 'Page title for SEO (50-60 characters)',
                  },
                  maxLength: 60,
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Description',
                  admin: {
                    description: 'Page description for search engines (150-160 characters)',
                  },
                  maxLength: 160,
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Social Share Image',
                  admin: {
                    description: 'Image shown when sharing on social media (1200x630px)',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  label: 'Keywords',
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
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
