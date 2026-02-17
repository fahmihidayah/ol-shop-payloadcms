import { composeMiddleware } from '@/feature/api/middleware'
import { withAuth } from '@/feature/api/middleware/with-auth'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { withRateLimit } from '@/feature/api/middleware/with-rate-limit'
import { withValidation } from '@/feature/api/middleware/with-validation'
import { addressFormSchema } from '@/feature/account/types/address'
import { EnhancedRequest } from '@/feature/api/types/request'
import { createAddressService } from '../../services/addresses/create-address-service'
import { createServiceContext } from '@/types/service-context'
import { Endpoint } from 'payload'

export async function createAddressHandler(req: EnhancedRequest) {
  const { validatedData } = req

  const result = await createAddressService({
    data: validatedData,
    serviceContext: await createServiceContext({
      collection: 'addresses',
      req,
    }),
  })

  if (result.error) {
    return {
      code: 400,
      message: result.message || 'Failed to create address',
      error: result.errorMessage,
      success: false,
    }
  }

  return {
    code: 201,
    success: true,
    message: 'Address created successfully',
    data: result.data,
  }
}

export const createAddressEndpoint: Endpoint = {
  path: '/v1/addresses',
  method: 'post',
  handler: composeMiddleware(
    withLogging,
    withAuth,
    withRateLimit(5, 60_000),
    withValidation(addressFormSchema),
  )(createAddressHandler),
}
