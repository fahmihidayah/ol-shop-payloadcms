import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    group: 'Customers',
  },
  auth: true,
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
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Date of Birth',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'not_specified' },
      ],
      label: 'Gender',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Account',
      admin: {
        description: 'Deactivate to prevent customer from logging in',
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      label: 'Customer Notes',
      admin: {
        description: 'Internal notes about this customer',
      },
    },
    // Email and password are added by default with auth: true
  ],
}
