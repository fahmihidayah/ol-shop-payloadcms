import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'sessionId', 'updatedAt'],
    group: 'Shop',
  },
  access: {
    // Only allow users to read their own carts
    read: ({ req }) => {
      // Admins can read all carts
      if (req.user?.collection === 'users') {
        return true
      }

      // Customers can only read their own cart
      if (req.user) {
        return {
          customer: {
            equals: req.user.id,
          },
        }
      }

      // Guest users controlled at action level (session-based)
      return true
    },
    create: () => {
      // Allow all - controlled at action level
      return true
    },
    update: ({ req }) => {
      // Admins can update all
      if (req.user?.collection === 'users') {
        return true
      }

      // Customers can only update their own
      if (req.user) {
        return {
          customer: {
            equals: req.user.id,
          },
        }
      }

      // Guest users controlled at action level
      return true
    },
    delete: ({ req }) => {
      // Admins can delete all
      if (req.user?.collection === 'users') {
        return true
      }

      // Customers can only delete their own
      if (req.user) {
        return {
          customer: {
            equals: req.user.id,
          },
        }
      }

      // Guest users controlled at action level
      return true
    },
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => `cart-${crypto.randomUUID()}`,
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
      name: 'address',
      type: 'relationship',
      relationTo: 'addresses',
      label: 'Selected Address',
      admin: {
        hidden: true,
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
    {
      name: 'isDone',
      type: 'checkbox',
      label: 'Is Done',
      defaultValue: false,
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
