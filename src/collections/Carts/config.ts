import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'sessionId', 'updatedAt'],
    group: 'Shop',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => crypto.randomUUID(),
      admin: {
        hidden: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Customer',
      admin: {
        description: 'Associated customer (for logged-in customers)',
        position: 'sidebar',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      unique: true,
      label: 'Session ID',
      admin: {
        description: 'Session identifier for guest users',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expires At',
      admin: {
        description: 'Automatic cart cleanup date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set expiration to 30 days from now if not set
        if (!data.expiresAt) {
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 30)
          data.expiresAt = expiryDate.toISOString()
        }
        return data
      },
    ],
  },
}
