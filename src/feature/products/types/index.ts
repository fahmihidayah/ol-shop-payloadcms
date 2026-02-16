import { Category, Product } from '@/payload-types'
import { paginationSchema } from '@/feature/api/types/pagination-schema'
import { z } from 'zod'
export const sortByOptions = ['name-asc', 'name-desc', 'price-asc', 'price-desc'] as const

export const getProductsSchema = paginationSchema.extend({
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  categories: z.union([z.array(z.string()), z.string().transform((v) => v.split(','))]).optional(),
  sortBy: z.enum(sortByOptions).optional(),
  search: z.string().optional(),
})

export type GetProductsParams = z.infer<typeof getProductsSchema>

export type SortByOption = GetProductsParams['sortBy']

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

export interface GetProductsResult {
  products: Product[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
