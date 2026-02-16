import { composeMiddleware } from '@/feature/api/middleware'
import { withAuth } from '@/feature/api/middleware/with-auth'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { getMeUser } from '@/lib/customer-utils'
import { Endpoint, PayloadRequest } from 'payload'

export const usersEndpoints: Endpoint[] = [
  {
    path: '/v1/user/me',
    method: 'get',
    handler: composeMiddleware(
      withLogging,
      withAuth,
    )(async (request: PayloadRequest): Promise<Response> => {
      return Response.json(request.user)
    }),
  },
]
