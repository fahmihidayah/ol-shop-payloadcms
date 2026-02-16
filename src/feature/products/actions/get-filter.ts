'use server'

import { getPayload } from 'payload'
import { ProductFilters, SortByOption } from '../types'

import config from '@payload-config'
import { Category, Product } from '@/payload-types'
/**
 * Gets available filter options for products
 * Returns price range, categories, and sort options
 */
export const getFilters = async (): Promise<ProductFilters> => {
  try {
    const payload = await getPayload({ config })

    // Get all active products to calculate price range
    const productsResult = await payload.find({
      collection: 'products',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 0, // Get all products
    })

    // Calculate price range from all product variants
    let minPrice = Infinity
    let maxPrice = 0

    productsResult.docs.forEach((product: Product) => {
      product['product-variant']?.forEach((variant) => {
        if (variant.isActive && variant.price) {
          minPrice = Math.min(minPrice, variant.price)
          maxPrice = Math.max(maxPrice, variant.price)
        }
      })
    })

    // If no products found, set default range
    if (minPrice === Infinity) minPrice = 0
    if (maxPrice === 0) maxPrice = 1000000

    // Get all categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 0, // Get all categories
      sort: 'name',
    })

    // Define sort options
    const sortByOptions = [
      { value: 'price-asc' as SortByOption, label: 'Price: Low to High' },
      { value: 'price-desc' as SortByOption, label: 'Price: High to Low' },
      { value: 'name-asc' as SortByOption, label: 'Name: A-Z' },
      { value: 'name-desc' as SortByOption, label: 'Name: Z-A' },
    ]

    return {
      priceRange: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
      },
      categories: categoriesResult.docs as Category[],
      sortByOptions,
    }
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
