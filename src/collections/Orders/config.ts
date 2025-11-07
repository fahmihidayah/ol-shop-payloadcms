import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'paymentStatus', 'totalAmount', 'createdAt'],
    group: 'Shop',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order Number',
      admin: {
        description: 'Unique order identifier',
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Customer',
      admin: {
        description: 'Registered customer (if logged in)',
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'guestName',
          type: 'text',
          label: 'Guest Name',
          admin: {
            description: 'For guest checkout',
            width: '33%',
          },
        },
        {
          name: 'guestEmail',
          type: 'email',
          label: 'Guest Email',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'guestPhone',
          type: 'text',
          label: 'Guest Phone',
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping Address',
      fields: [
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
          label: 'Phone',
        },
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
          label: 'Address Line 1',
        },
        {
          name: 'addressLine2',
          type: 'text',
          label: 'Address Line 2',
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
                width: '33%',
              },
            },
            {
              name: 'province',
              type: 'text',
              required: true,
              label: 'Province/State',
              admin: {
                width: '33%',
              },
            },
            {
              name: 'postalCode',
              type: 'text',
              required: true,
              label: 'Postal Code',
              admin: {
                width: '34%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'orderStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Order Status',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      label: 'Payment Status',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Total Amount',
      admin: {
        description: 'Total order amount',
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Shipping Cost',
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Discount Amount',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Order Notes',
      admin: {
        description: 'Internal notes or customer comments',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate order number for new orders
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now()
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          data.orderNumber = `ORD-${timestamp}-${random}`
        }
        return data
      },
    ],
  },
}
