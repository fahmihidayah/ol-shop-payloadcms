import type { CollectionConfig } from 'payload'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'sku', 'price', 'stockQuantity'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Variant Title',
      admin: {
        description: 'e.g., "Large / Red" or "32GB / Black"',
      },
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'SKU',
      admin: {
        description: 'Stock Keeping Unit - unique identifier',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Price',
      admin: {
        description: 'Current selling price',
      },
    },
    {
      name: 'oldPrice',
      type: 'number',
      min: 0,
      label: 'Original Price',
      admin: {
        description: 'Show as strikethrough if different from current price',
      },
    },
    {
      name: 'cost',
      type: 'number',
      min: 0,
      label: 'Cost',
      admin: {
        description: 'Your cost for this variant (internal use)',
      },
    },
    {
      name: 'stockQuantity',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Stock Quantity',
    },
    {
      name: 'lowStockThreshold',
      type: 'number',
      defaultValue: 10,
      min: 0,
      label: 'Low Stock Alert Threshold',
      admin: {
        description: 'Get notified when stock falls below this number',
      },
    },
    {
      name: 'weight',
      type: 'number',
      min: 0,
      label: 'Weight (kg)',
      admin: {
        description: 'Product weight for shipping calculations',
      },
    },
    {
      name: 'dimensions',
      type: 'group',
      label: 'Dimensions',
      fields: [
        {
          name: 'length',
          type: 'number',
          min: 0,
          label: 'Length (cm)',
        },
        {
          name: 'width',
          type: 'number',
          min: 0,
          label: 'Width (cm)',
        },
        {
          name: 'height',
          type: 'number',
          min: 0,
          label: 'Height (cm)',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Variant Image',
      admin: {
        description: 'Specific image for this variant',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Make this variant available for purchase',
      },
    },
  ],
}
