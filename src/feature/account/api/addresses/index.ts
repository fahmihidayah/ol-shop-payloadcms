import { composeMiddleware } from '@/feature/api/middleware'
import { withAuth } from '@/feature/api/middleware/with-auth'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { withRateLimit } from '@/feature/api/middleware/with-rate-limit'
import { withValidation } from '@/feature/api/middleware/with-validation'
import { addressFormSchema } from '@/feature/account/types/types'
import { createService } from '@/lib/services/create-service'
import { EnhancedRequest } from '@/feature/api/types/request'

import { Endpoint } from 'payload'
import { getListService } from '@/lib/services/get-list-service'
import { withJsonResponse } from '@/feature/api/middleware/with-json-response'

export const addressEndpoint: Endpoint[] = [
  {
    path: '/v1/addresses',
    method: 'get',
    handler: composeMiddleware(
      withLogging,
      withAuth,
      withRateLimit(5, 60_000),
    )(async (req: EnhancedRequest) => {
      const address = await getListService({
        serviceContext: {
          collection: 'addresses',
          payload: req.payload,
        },
        options: {
          where: {
            and: [
              req.user
                ? {
                    customer: {
                      equals: req.user.id ?? '',
                    },
                  }
                : {
                    sessionId: {
                      equals: req.sessionId ?? '',
                    },
                  },
            ],
          },
        },
      })
      return { code: 200, message: 'ok', data: address.docs.map((e) => e) }
    }),
  },
  {
    path: '/v1/addresses',
    method: 'post',
    handler: composeMiddleware(
      withLogging,
      withAuth,

      withRateLimit(5, 60_000),
      withValidation(addressFormSchema),
    )(async (req) => {
      const { validatedData } = req as EnhancedRequest

      const user = req.user
      const sessionId = req.headers.get('sessionId') ?? undefined

      const finalData = {
        ...validatedData,
        ...(user ? { customer: user.id } : { sessionId: sessionId }),
      }
      const created = await createService({
        serviceContext: {
          collection: 'addresses',
          payload: req.payload,
        },
        data: finalData,
        overrideAccess: true,
      })

      return {
        code: 200,
        success: true,
        data: created,
      }
    }),
  },
]
