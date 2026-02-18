import { composeMiddleware } from '@/feature/api/middleware'
import { withAuth } from '@/feature/api/middleware/with-auth'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { withRateLimit } from '@/feature/api/middleware/with-rate-limit'
import { EnhancedRequest } from '@/feature/api/types/request'
import { createServiceContext } from '@/types/service-context'
import { Endpoint } from 'payload'
import { AddressService } from '../../services/address-service'

export async function deleteAddressHandler(req: EnhancedRequest) {
  const addressId = req.routeParams?.id

  if (!addressId) {
    return {
      code: 400,
      message: 'Address ID is required',
      success: false,
    }
  }

  const result = await AddressService.delete({
    id: addressId as string,
    serviceContext: await createServiceContext({
      collection: 'addresses',
      req,
    }),
  })

  if (result.error) {
    return {
      code: 400,
      message: result.message || 'Failed to delete address',
      success: false,
    }
  }

  return {
    code: 200,
    success: true,
    message: 'Address deleted successfully',
    data: result.data,
  }
}

export const deleteAddressEndpoint: Endpoint = {
  path: '/v1/addresses/:id',
  method: 'delete',
  handler: composeMiddleware(withLogging, withAuth, withRateLimit(5, 60_000))(deleteAddressHandler),
}
