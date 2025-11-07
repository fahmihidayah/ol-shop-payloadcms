import type { CollectionConfig } from 'payload'

export const CartItems: CollectionConfig = {
  slug: 'cart-items',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['cart', 'variant', 'quantity', 'subtotal'],
    group: 'Shop',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'cart',
      type: 'relationship',
      relationTo: 'carts',
      required: true,
      label: 'Cart',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
      label: 'Product Variant',
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      defaultValue: 1,
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
        description: 'Price at the time of adding to cart',
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
