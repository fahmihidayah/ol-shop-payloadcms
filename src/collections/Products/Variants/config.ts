import { CollectionConfig } from 'payload'
import { getProductVariantField } from '../product-variant'

export const ProductVariant: CollectionConfig = {
  slug: 'productVariants',
  admin: {
    hidden: true,
  },
  fields: [
    ...getProductVariantField(),
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      hidden: true,
    },
  ],
  timestamps: true,
}
