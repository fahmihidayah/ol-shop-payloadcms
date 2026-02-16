import { composeMiddleware } from '@/feature/api/middleware'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { getHomeConfig } from '@/feature/home/actions'
import { Endpoint, Payload, PayloadRequest } from 'payload'

export const homeEndpoints: Endpoint[] = [
  {
    path: '/v1/home',
    method: 'get',
    handler: composeMiddleware(withLogging)(async (request: PayloadRequest): Promise<Response> => {
      const home = await getHomeConfig()
      return Response.json(home)
    }),
  },
]
