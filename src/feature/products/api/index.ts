import { composeMiddleware } from '@/feature/api/middleware'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { getProducts } from '@/feature/products/actions/get-list-products'
import { EnhancedRequest } from '@/feature/api/types/request'
import { Endpoint, PayloadRequest } from 'payload'
import { getFilters } from '../actions/get-filter'
import { withQueryParams } from '@/feature/api/middleware/with-query-params'
import { getProductsSchema } from '../types'

export const productEndpoints: Endpoint[] = [
  {
    path: '/v1/products-filter',
    method: 'get',
    handler: composeMiddleware(withLogging)(async () => {
      const filters = await getFilters()
      return filters
    }),
  },
  {
    path: '/v1/products',
    method: 'get',
    handler: composeMiddleware(
      withLogging,
      withQueryParams(getProductsSchema),
    )(async (request: EnhancedRequest) => {
      const { queryParams } = request

      const products = await getProducts(queryParams)

      return products
    }),
  },
]
