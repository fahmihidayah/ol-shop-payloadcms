import type { CollectionConfig } from 'payload'

export const PaymentOptions: CollectionConfig = {
    slug: 'payment-options',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'type', 'isActive', 'createdAt'],
        group: 'Shop',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Payment Option Name',
            admin: {
                description: 'e.g., "Credit Card", "Bank Transfer BCA"',
            },
        },
        {
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Credit Card', value: 'credit_card' },
                { label: 'Bank Transfer', value: 'bank_transfer' },
                { label: 'Cash on Delivery', value: 'cod' },
                { label: 'E-Wallet', value: 'e_wallet' },
                { label: 'PayPal', value: 'paypal' },
                { label: 'Stripe', value: 'stripe' },
            ],
            label: 'Payment Type',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            admin: {
                description: 'Additional information about this payment method',
            },
        },
        {
            name: 'icon',
            type: 'upload',
            relationTo: 'media',
            label: 'Icon/Logo',
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
            label: 'Active',
            admin: {
                description: 'Enable or disable this payment option',
            },
        },
        {
            name: 'processingFee',
            type: 'number',
            min: 0,
            defaultValue: 0,
            label: 'Processing Fee (%)',
            admin: {
                description: 'Fee percentage for this payment method',
            },
        },
        {
            name: 'instructions',
            type: 'richText',
            label: 'Payment Instructions',
            admin: {
                description: 'Detailed instructions for customers',
            },
        },
    ],
}