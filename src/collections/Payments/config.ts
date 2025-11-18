import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'transactionId',
    defaultColumns: ['order', 'method', 'status', 'amount', 'createdAt'],
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
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Order',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'method',
      type: 'select',
      required: true,
      options: [
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Cash on Delivery', value: 'cod' },
        { label: 'E-Wallet', value: 'e_wallet' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Stripe', value: 'stripe' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Payment Method',
    },
    {
      name: 'transactionId',
      type: 'text',
      label: 'Transaction ID',
      admin: {
        description: 'Payment gateway transaction identifier',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Payment Status',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Amount',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      label: 'Currency',
      admin: {
        description: 'Currency code (e.g., USD, EUR, IDR)',
      },
    },
    {
      name: 'gatewayResponse',
      type: 'textarea',
      label: 'Gateway Response',
      admin: {
        description: 'Raw response from payment gateway (JSON format)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional payment notes or details',
      },
    },
  ],
}
