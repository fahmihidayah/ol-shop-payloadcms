'use server'

import { Category, Product } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getNewArrival = async (count: number): Promise<Product[]> => {
  const payload = await getPayload({
    config,
  })

  const products = await payload.find({
    collection: 'products',
    limit: count,
    sort: 'createdAt',
  })

  return products.docs
}

export type SortByOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

export interface ProductFilters {
  priceRange: {
    min: number
    max: number
  }
  categories: Category[]
  sortByOptions: Array<{
    value: SortByOption
    label: string
  }>
}

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

export interface GetProductsParams {
  minPrice?: number
  maxPrice?: number
  categories?: string[] // Array of category IDs
  sortBy?: SortByOption
  search?: string
  page?: number
  limit?: number
}

export interface GetProductsResult {
  products: Product[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Gets products with filtering, sorting, and pagination
 */
export const getProducts = async (params: GetProductsParams = {}): Promise<GetProductsResult> => {
  try {
    const {
      minPrice,
      maxPrice,
      categories = [],
      sortBy = 'price-asc',
      search = '',
      page = 1,
      limit = 10,
    } = params

    const payload = await getPayload({ config })

    // Build the where query
    const whereConditions: any = {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
      ],
    }

    // Add search filter
    if (search) {
      whereConditions.and.push({
        or: [
          {
            name: {
              contains: search,
            },
          },
          {
            'seo.metaTitle': {
              contains: search,
            },
          },
          {
            'seo.metaDescription': {
              contains: search,
            },
          },
        ],
      })
    }

    // Add category filter
    if (categories.length > 0) {
      whereConditions.and.push({
        category: {
          in: categories,
        },
      })
    }

    // Add price range filter using defaultVariantPrice
    if (minPrice !== undefined) {
      whereConditions.and.push({
        defaultVariantPrice: {
          greater_than_or_equal: minPrice,
        },
      })
    }

    if (maxPrice !== undefined) {
      whereConditions.and.push({
        defaultVariantPrice: {
          less_than_or_equal: maxPrice,
        },
      })
    }

    // Map sort options to PayloadCMS sort strings
    const sortMap: Record<SortByOption, string> = {
      'name-asc': 'name',
      'name-desc': '-name',
      'price-asc': 'defaultVariantPrice',
      'price-desc': '-defaultVariantPrice',
    }

    // Fetch products with database-level filtering, sorting, and pagination
    const productsResult = await payload.find({
      collection: 'products',
      where: whereConditions,
      sort: sortMap[sortBy],
      limit: limit,
      page: page,
      depth: 2,
    })

    return {
      products: productsResult.docs as Product[],
      totalDocs: productsResult.totalDocs,
      totalPages: productsResult.totalPages,
      page: productsResult.page || page,
      hasNextPage: productsResult.hasNextPage || false,
      hasPrevPage: productsResult.hasPrevPage || false,
    }
  } catch (error) {
    console.error('[GET_PRODUCTS] Error:', error)
    return {
      products: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  }
}

/**
 * Gets a single product by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const payload = await getPayload({ config })

    const productsResult = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            isActive: {
              equals: true,
            },
          },
        ],
      },
      limit: 1,
      depth: 2,
    })

    if (productsResult.docs.length === 0) {
      return null
    }

    return productsResult.docs[0] as Product
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

    const productsResult = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            category: {
              equals: typeof product.category === 'string' ? product.category : product.category?.id,
            },
          },
          {
            id: {
              not_equals: product.id,
            },
          },
          {
            isActive: {
              equals: true,
            },
          },
        ],
      },
      limit: 10,
      depth: 2,
      sort: '-createdAt',
    })

    return productsResult.docs as Product[]
  } catch (error) {
    console.error('[GET_RELATED_PRODUCTS] Error:', error)
    return []
  }
}
