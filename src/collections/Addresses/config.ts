import type { CollectionConfig } from 'payload'

export const Addresses: CollectionConfig = {
    slug: 'addresses',
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['customer', 'label', 'recipientName', 'city', 'isDefault'],
        group: 'Customers',
    },
    access: {
        // Only allow users to read their own addresses
        read: ({ req }) => {
            // Admins can read all addresses
            if (req.user?.collection === 'users') {
                return true
            }

            // Customers can only read their own addresses
            if (req.user) {
                return {
                    customer: {
                        equals: req.user.id,
                    },
                }
            }

            // For guest users, access will be controlled at the action level
            // PayloadCMS access control cannot access cookies easily
            return true
        },
        create: () => {
            // Allow all - will be controlled at action level
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
            defaultValue: () => `address-${crypto.randomUUID()}`,
            admin: {
                hidden: true,
            },
        },
        {
            name: 'sessionId',
            type: 'text',
            required: false,
            admin: {
                hidden: true,
            },
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'customers',
            required: false,
            label: 'Customer',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'label',
            type: 'text',
            required: true,
            label: 'Address Label',
            admin: {
                description: 'e.g., "Home", "Office", "Mom\'s House"',
            },
        },
        {
            name: 'recipientName',
            type: 'text',
            required: true,
            label: 'Recipient Name',
        },
        {
            name: 'phone',
            type: 'text',
            required: true,
            label: 'Phone Number',
        },
        {
            name: 'addressLine1',
            type: 'text',
            required: true,
            label: 'Address Line 1',
            admin: {
                description: 'Street address, P.O. box, company name',
            },
        },
        {
            name: 'addressLine2',
            type: 'text',
            label: 'Address Line 2',
            admin: {
                description: 'Apartment, suite, unit, building, floor, etc.',
            },
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'city',
                    type: 'text',
                    required: true,
                    label: 'City',
                    admin: {
                        width: '50%',
                    },
                },
                {
                    name: 'province',
                    type: 'text',
                    required: true,
                    label: 'Province/State',
                    admin: {
                        width: '50%',
                    },
                },
            ],
        },
        {
            name: 'postalCode',
            type: 'text',
            required: true,
            label: 'Postal Code',
        },
        {
            name: 'country',
            type: 'text',
            defaultValue: 'Indonesia',
            label: 'Country',
        },
        {
            name: 'isDefault',
            type: 'checkbox',
            defaultValue: false,
            label: 'Set as Default Address',
            admin: {
                description: 'Use this address as the default shipping address',
            },
        },
        {
            name: 'coordinates',
            type: 'group',
            label: 'GPS Coordinates',
            admin: {
                description: 'Optional location coordinates for delivery',
            },
            fields: [
                {
                    name: 'latitude',
                    type: 'number',
                    label: 'Latitude',
                },
                {
                    name: 'longitude',
                    type: 'number',
                    label: 'Longitude',
                },
            ],
        },
    ],
}