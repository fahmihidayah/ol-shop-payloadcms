import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'
import { CartItem, Category, OrderItem, Product } from '@/payload-types'
import { PaginatedDocs } from 'payload'
import { GetProductsParams, ProductFilters, SortByOption } from '../types'

/**
 * ProductService - Handles all product-related database operations
 *
 * This service provides methods for:
 * - Fetching products with filtering, sorting, and pagination
 * - Getting product filters (price range, categories)
 * - Finding products by slug
 * - Getting related products
 * - Getting new arrival products
 * - Validating products and variants for cart operations
 */
export const ProductService = {
  /**
   * Gets products with filtering, sorting, and pagination
   *
   * @param serviceContext - Service context containing payload instance
   * @param params - Query parameters including filters, sort, pagination
   * @returns Promise resolving to ServiceResult containing paginated products
   *
   * @example
   * ```typescript
   * const result = await ProductService.getProducts({
   *   serviceContext: { collection: 'products', payload },
   *   params: {
   *     minPrice: 10000,
   *     maxPrice: 100000,
   *     categories: ['cat-1', 'cat-2'],
   *     sortBy: 'price-asc',
   *     search: 'shirt',
   *     page: 1,
   *     limit: 10
   *   }
   * })
   * ```
   */
  getProducts: async ({
    serviceContext,
    params,
  }: {
    serviceContext: ServiceContext
    params: GetProductsParams
  }): Promise<ServiceResult<PaginatedDocs<Product>>> => {
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
    const productsResult = await serviceContext.payload.find({
      collection: 'products',
      where: whereConditions,
      sort: sortMap[sortBy],
      limit: limit,
      page: page,
      depth: 2,
    })

    return {
      data: productsResult,
      error: false,
    }
  },

  /**
   * Gets available filter options for products
   *
   * Returns price range calculated from active product variants,
   * all available categories, and predefined sort options.
   *
   * @param serviceContext - Service context containing payload instance
   * @returns Promise resolving to ServiceResult containing filter options
   *
   * @example
   * ```typescript
   * const result = await ProductService.getFilters({
   *   serviceContext: { collection: 'products', payload }
   * })
   *
   * console.log(result.data.priceRange) // { min: 10000, max: 500000 }
   * console.log(result.data.categories) // [...Category objects]
   * ```
   */
  getFilters: async ({
    serviceContext,
  }: {
    serviceContext: ServiceContext
  }): Promise<ServiceResult<ProductFilters>> => {
    // Get all active products to calculate price range
    const productsResult = await serviceContext.payload.find({
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
    const categoriesResult = await serviceContext.payload.find({
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
      data: {
        priceRange: {
          min: Math.floor(minPrice),
          max: Math.ceil(maxPrice),
        },
        categories: categoriesResult.docs as Category[],
        sortByOptions,
      },
      error: false,
    }
  },

  /**
   * Gets a single product by slug
   *
   * @param serviceContext - Service context containing payload instance
   * @param slug - Product slug to search for
   * @returns Promise resolving to ServiceResult containing the product or null
   *
   * @example
   * ```typescript
   * const result = await ProductService.getProductBySlug({
   *   serviceContext: { collection: 'products', payload },
   *   slug: 'blue-shirt-xl'
   * })
   *
   * if (!result.error && result.data) {
   *   console.log('Product found:', result.data.name)
   * }
   * ```
   */
  getProductBySlug: async ({
    serviceContext,
    slug,
  }: {
    serviceContext: ServiceContext
    slug: string
  }): Promise<ServiceResult<Product | null>> => {
    const productsResult = await serviceContext.payload.find({
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
      return {
        data: null,
        error: false,
      }
    }

    return {
      data: productsResult.docs[0] as Product,
      error: false,
    }
  },

  /**
   * Gets related products from the same category
   *
   * Returns up to specified count of products from the same category,
   * excluding the current product. Sorted by creation date (newest first).
   *
   * @param serviceContext - Service context containing payload instance
   * @param product - The current product to find related products for
   * @param limit - Maximum number of related products to return (default: 10)
   * @returns Promise resolving to ServiceResult containing array of related products
   *
   * @example
   * ```typescript
   * const result = await ProductService.getRelatedProducts({
   *   serviceContext: { collection: 'products', payload },
   *   product: currentProduct,
   *   limit: 5
   * })
   *
   * console.log(`Found ${result.data.length} related products`)
   * ```
   */
  getRelatedProducts: async ({
    serviceContext,
    product,
    limit = 10,
  }: {
    serviceContext: ServiceContext
    product: Product
    limit?: number
  }): Promise<ServiceResult<Product[]>> => {
    const productsResult = await serviceContext.payload.find({
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
      limit,
      depth: 2,
      sort: '-createdAt',
    })

    return {
      data: productsResult.docs as Product[],
      error: false,
    }
  },

  /**
   * Gets newest products
   *
   * Returns the most recently created active products, sorted by creation date.
   *
   * @param serviceContext - Service context containing payload instance
   * @param count - Number of products to return
   * @returns Promise resolving to ServiceResult containing array of new arrival products
   *
   * @example
   * ```typescript
   * const result = await ProductService.getNewArrivals({
   *   serviceContext: { collection: 'products', payload },
   *   count: 8
   * })
   * ```
   */
  getNewArrivals: async ({
    serviceContext,
    count,
  }: {
    serviceContext: ServiceContext
    count: number
  }): Promise<ServiceResult<Product[]>> => {
    const productsResult = await serviceContext.payload.find({
      collection: 'products',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: count,
      sort: '-createdAt',
      depth: 2,
    })

    return {
      data: productsResult.docs as Product[],
      error: false,
    }
  },

  /**
   * Validates a product exists and is active
   *
   * @param serviceContext - Service context containing payload instance
   * @param productId - Product ID to validate
   * @returns Promise resolving to ServiceResult containing the product or error
   *
   * @example
   * ```typescript
   * const result = await ProductService.validateProduct({
   *   serviceContext: { collection: 'products', payload },
   *   productId: 'prod-123'
   * })
   *
   * if (result.error) {
   *   console.error(result.message) // 'Product not found' or 'Product is not available'
   * }
   * ```
   */
  validateProduct: async ({
    serviceContext,
    productId,
  }: {
    serviceContext: ServiceContext
    productId: string
  }): Promise<ServiceResult<Product>> => {
    const product = await serviceContext.payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      return {
        error: true,
        message: 'Product not found',
      }
    }

    if (!product.isActive) {
      return {
        error: true,
        message: 'Product is not available',
      }
    }

    return {
      data: product,
      error: false,
    }
  },

  /**
   * Validates a product variant exists, is active, and has sufficient stock
   *
   * @param product - Product containing the variant
   * @param variantId - Variant ID to validate
   * @param requestedQuantity - Quantity to check stock for
   * @returns ServiceResult containing the variant or error
   *
   * @example
   * ```typescript
   * const result = ProductService.validateVariant({
   *   product: productData,
   *   variantId: 'var-456',
   *   requestedQuantity: 2
   * })
   *
   * if (result.error) {
   *   console.error(result.message) // Stock or availability error
   * }
   * ```
   */
  validateVariant: ({
    product,
    variantId,
    requestedQuantity,
  }: {
    product: Product
    variantId: string
    requestedQuantity: number
  }): ServiceResult<any> => {
    const variant = product['product-variant']?.find((v) => v.id === variantId)

    if (!variant) {
      return {
        error: true,
        message: 'Product variant not found',
      }
    }

    if (!variant.isActive) {
      return {
        error: true,
        message: 'Product variant is not available',
      }
    }

    if (variant.stockQuantity < requestedQuantity) {
      return {
        error: true,
        message: `Insufficient stock. Only ${variant.stockQuantity} items available`,
      }
    }

    return {
      data: variant,
      error: false,
    }
  },

  /**
   * Decreases stock quantity for a specific product variant
   *
   * @param context - Service context containing payload instance
   * @param cartItem - Cart item containing product, variant, and quantity information
   * @returns Promise that resolves when stock is updated
   *
   * @example
   * ```typescript
   * await ProductService.decreaseProductStock({
   *   context: { payload },
   *   cartItem: {
   *     product: productData,
   *     variant: 'variant-id',
   *     quantity: 2
   *   }
   * })
   * ```
   */
  decreaseProductStock: async ({
    context,
    orderItem,
  }: {
    context: ServiceContext
    orderItem: OrderItem
  }): Promise<void> => {
    const newOrderItem = await context.payload.findByID({
      collection: 'order-items',
      id: orderItem.id,
    })
    if (newOrderItem && newOrderItem.isStockUpdated) {
      // Stock already updated for this order item, skip to prevent double decrement
      return
    }
    const product = await context.payload.findByID({
      collection: 'products',
      id: (orderItem.product as Product).id,
    })

    if (!product) {
      return
    }

    // Update only the matched variant's stock
    const updatedVariants = product['product-variant']?.map((variant) => {
      if (variant.id === orderItem.variant) {
        return {
          ...variant,
          stockQuantity: variant.stockQuantity - orderItem.quantity,
        }
      }
      // Return unchanged variant
      return variant
    })

    await context.payload.update({
      collection: 'products',
      id: (orderItem.product as Product).id,
      data: {
        'product-variant': updatedVariants,
      },
    })

    await context.payload.update({
      collection: 'order-items',
      id: orderItem.id,
      data: {
        ...orderItem,
        isStockUpdated: true,
      },
    })
  },
}
