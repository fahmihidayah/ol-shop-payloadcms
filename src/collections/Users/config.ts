import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    group: 'Admin',
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => `user-${crypto.randomUUID()}`,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      validate: (value: string | null | undefined) => {
        if (value && typeof value === 'string' && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        return true
      },
    },
    // Email and password are added by default with auth: true
  ],
  hooks: {
    afterChange: [({ collection, data, doc, context, operation, previousDoc, req }) => {}],
  },
}
