import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => "user-" + crypto.randomUUID(),
      admin: {
        hidden: true,
      },
    },
    // Email added by default
    // Add more fields as needed
  ],
}
