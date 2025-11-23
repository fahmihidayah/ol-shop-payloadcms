import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => `media-${crypto.randomUUID()}`,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
