'use server'

import { getPayload } from 'payload'
import { ProductFilters } from '../types'
import config from '@payload-config'
import { ProductService } from '../services/product-service'

/**
 * Gets available filter options for products
 * Returns price range, categories, and sort options
 */
export const getFilters = async (): Promise<ProductFilters> => {
  try {
    const payload = await getPayload({ config })

    const result = await ProductService.getFilters({
      serviceContext: {
        payload,
      },
    })

    if (result.error) {
      throw new Error(result.message || 'Failed to get filters')
    }

    return result.data!
  } catch (error) {
    console.error('[GET_FILTERS] Error:', error)
    return {
      priceRange: { min: 0, max: 1000000 },
      categories: [],
      sortByOptions: [
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'name-asc', label: 'Name: A-Z' },
        { value: 'name-desc', label: 'Name: Z-A' },
      ],
    }
  }
}
