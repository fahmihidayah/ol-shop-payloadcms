'use server'

import { getPayload, PaginatedDocs } from 'payload'
import config from '@payload-config'
import { GetProductsParams, SortByOption } from '../types'
import { Product } from '@/payload-types'
import { getListService } from '@/lib/services/get-list-service'

export const getNewArrival = async (count: number): Promise<Product[]> => {
  const payload = await getPayload({
    config,
  })

  const products = await getListService<Product>({
    serviceContext: {
      collection: 'products',
      payload: payload,
    },
    options: {
      limit: count,
      sort: 'createdAt',
    },
  })

  return products.docs
}

/**
 * Gets products with filtering, sorting, and pagination
 */
export const getProducts = async (
  params: GetProductsParams,
): Promise<PaginatedDocs<Product> | null> => {
  try {
    const payload = await getPayload({ config })

    const {
      minPrice,
      maxPrice,
      categories = [],
      sortBy = 'price-asc',
      search = '',
      page = 1,
      limit = 10,
    } = params

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
    const sortMap: Record<string, string> = {
      'name-asc': 'name',
      'name-desc': '-name',
      'price-asc': 'defaultVariantPrice',
      'price-desc': '-defaultVariantPrice',
    }

    // Fetch products with database-level filtering, sorting, and pagination
    // const productsResult = await payload.find({
    //   collection: 'products',
    //   where: whereConditions,
    //   sort: sortMap[sortBy],
    //   limit: limit,
    //   page: page,
    //   depth: 2,
    // })

    const productsResult = await getListService<Product>({
      serviceContext: {
        payload: await getPayload({ config }),
        collection: 'products',
      },
      options: {
        where: whereConditions,
        sort: sortMap[sortBy],
        limit: limit,
        page: page,
        depth: 2,
      },
    })

    return productsResult
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
              equals:
                typeof product.category === 'string' ? product.category : product.category?.id,
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
