import { composeMiddleware } from '@/feature/api/middleware'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { Endpoint, PayloadRequest } from 'payload'

export const checkoutEndpoints: Endpoint[] = [
  {
    path: '/v1/checkout',
    method: 'get',
    handler: composeMiddleware(withLogging)(async (request: PayloadRequest): Promise<Response> => {
      return Response.json({})
    }),
  },
]
