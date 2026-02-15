import { slugField } from '@/fields/slug'
import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            ...slugField('title'),
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Image',
              admin: {
                description: 'Main image displayed at the top of the page',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
            {
              name: 'status',
              type: 'select',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              defaultValue: 'draft',
              required: true,
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'SEO Title',
                  admin: {
                    description: 'Override the page title for search engines (50-60 characters)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Description',
                  admin: {
                    description: 'Brief description for search results (150-160 characters)',
                  },
                  maxLength: 160,
                },
                {
                  name: 'keywords',
                  type: 'text',
                  label: 'Meta Keywords',
                  admin: {
                    description: 'Comma-separated keywords for search engines',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Open Graph Image',
                  admin: {
                    description: 'Image for social media sharing (1200x630px recommended)',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  label: 'No Index',
                  admin: {
                    description: 'Prevent search engines from indexing this page',
                  },
                  defaultValue: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
