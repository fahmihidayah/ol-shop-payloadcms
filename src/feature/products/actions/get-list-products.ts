'use server'

import { getPayload, PaginatedDocs } from 'payload'
import config from '@payload-config'
import { GetProductsParams } from '../types'
import { Product } from '@/payload-types'
import { ProductService } from '../services/product-service'

/**
 * Gets new arrival products
 * @param count - Number of products to return
 * @returns Array of newest products
 */
export const getNewArrival = async (count: number): Promise<Product[]> => {
  try {
    const payload = await getPayload({ config })

    const result = await ProductService.getNewArrivals({
      serviceContext: {
        payload,
      },
      count,
    })

    if (result.error) {
      console.error('[GET_NEW_ARRIVAL] Error:', result.message)
      return []
    }

    return result.data || []
  } catch (error) {
    console.error('[GET_NEW_ARRIVAL] Error:', error)
    return []
  }
}

/**
 * Gets products with filtering, sorting, and pagination
 */
export const getProducts = async (
  params: GetProductsParams,
): Promise<PaginatedDocs<Product> | null> => {
  try {
    const payload = await getPayload({ config })

    const result = await ProductService.getProducts({
      serviceContext: {
        payload,
      },
      params,
    })

    if (result.error) {
      console.error('[GET_PRODUCTS] Error:', result.message)
      return null
    }

    return result.data || null
  } catch (error) {
    console.error('[GET_PRODUCTS] Error:', error)
    return null
  }
}

/**
 * Gets a single product by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const payload = await getPayload({ config })

    const result = await ProductService.getProductBySlug({
      serviceContext: {
        payload,
      },
      slug,
    })

    if (result.error) {
      console.error('[GET_PRODUCT_BY_SLUG] Error:', result.message)
      return null
    }

    return result.data ?? null
  } catch (error) {
    console.error('[GET_PRODUCT_BY_SLUG] Error:', error)
    return null
  }
}

/**
 * Gets related products from the same category
 * Returns up to 10 products, excluding the current product
 */
export const getRelatedProducts = async (product: Product): Promise<Product[]> => {
  try {
    const payload = await getPayload({ config })

    const result = await ProductService.getRelatedProducts({
      serviceContext: {
        payload,
      },
      product,
      limit: 10,
    })

    if (result.error) {
      console.error('[GET_RELATED_PRODUCTS] Error:', result.message)
      return []
    }

    return result.data || []
  } catch (error) {
    console.error('[GET_RELATED_PRODUCTS] Error:', error)
    return []
  }
}
