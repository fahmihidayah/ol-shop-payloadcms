import type { CollectionConfig } from 'payload'

export const VariantOptions: CollectionConfig = {
  slug: 'variant-options',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['variant', 'name', 'value'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
      label: 'Product Variant',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Option Name',
      admin: {
        description: 'e.g., "Size", "Color", "Material"',
      },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      label: 'Option Value',
      admin: {
        description: 'e.g., "Large", "Red", "Cotton"',
      },
    },
  ],
}
