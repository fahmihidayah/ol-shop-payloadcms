import { composeMiddleware } from '@/feature/api/middleware'
import { withAuth } from '@/feature/api/middleware/with-auth'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { withRateLimit } from '@/feature/api/middleware/with-rate-limit'
import { EnhancedRequest } from '@/feature/api/types/request'
import { createServiceContext } from '@/types/service-context'
import { Endpoint } from 'payload'
import { AddressService } from '../../services/address-service'

export async function getListAddressHandler(req: EnhancedRequest) {
  const result = await AddressService.findAll({
    serviceContext: await createServiceContext({
      req,
    }),
  })

  if (result.error) {
    return {
      code: 400,
      message: result.message || 'Failed to fetch addresses',
      data: null,
    }
  }

  return {
    code: 200,
    message: 'ok',
    data: result.data?.docs ?? [],
  }
}

export const getListAddressEndpoint: Endpoint = {
  path: '/v1/addresses',
  method: 'get',
  handler: composeMiddleware(
    withLogging,
    withAuth,
    withRateLimit(5, 60_000),
  )(getListAddressHandler),
}
