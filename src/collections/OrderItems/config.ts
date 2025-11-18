import type { CollectionConfig } from 'payload'

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  admin: {
    hidden: true,
    useAsTitle: 'id',
    defaultColumns: ['order', 'variant', 'quantity', 'price', 'subtotal'],
    group: 'Shop',
  },
  access: {
    read: () => true,
  },
  fields: [
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'variant',
      type: 'text',
      required: true,
      label: 'Product Variant',
    },
    {
      name: 'productSnapshot',
      type: 'group',
      label: 'Product Details (Snapshot)',
      admin: {
        description: 'Stored product details at time of purchase',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Product Title',
        },
        {
          name: 'variantTitle',
          type: 'text',
          label: 'Variant Title',
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL',
        },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      label: 'Quantity',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price per Unit',
      admin: {
        description: 'Price at the time of purchase',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      label: 'Subtotal',
      admin: {
        description: 'Calculated as quantity × price',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate subtotal automatically
        if (data.quantity && data.price) {
          data.subtotal = data.quantity * data.price
        }
        return data
      },
    ],
  },
}
