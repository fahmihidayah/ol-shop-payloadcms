import { composeMiddleware } from '@/feature/api/middleware'
import { withLogging } from '@/feature/api/middleware/with-logging'
import { Endpoint, PayloadRequest } from 'payload'
import { updateOrderFromCallback } from '../actions/order-confirmation/update-order'
import type { DuitkuCallbackParams } from '../types/order'

export const checkoutEndpoints: Endpoint[] = [
  {
    path: '/v1/checkout',
    method: 'get',
    handler: composeMiddleware(withLogging)(async (request: PayloadRequest): Promise<Response> => {
      return Response.json({})
    }),
  },
  {
    path: '/v1/order/callback',
    method: 'post',
    handler: composeMiddleware(withLogging)(async (request: PayloadRequest): Promise<Response> => {
      try {
        // Parse callback data from Duitku
        const body = await request?.json?.()

        console.log('[DUITKU_CALLBACK] Received webhook:', {
          merchantOrderId: body.merchantOrderId,
          resultCode: body.resultCode,
          amount: body.amount,
        })

        // Validate required fields
        const requiredFields = [
          'merchantCode',
          'amount',
          'merchantOrderId',
          'signature',
          'resultCode',
        ]
        const missingFields = requiredFields.filter((field) => !body[field])

        if (missingFields.length > 0) {
          console.error('[DUITKU_CALLBACK] Missing required fields:', missingFields)
          return Response.json(
            {
              success: false,
              error: `Missing required fields: ${missingFields.join(', ')}`,
            },
            { status: 400 },
          )
        }

        // Prepare callback params
        const callbackParams: DuitkuCallbackParams = {
          merchantCode: body.merchantCode,
          amount: parseFloat(body.amount),
          merchantOrderId: body.merchantOrderId,
          productDetail: body.productDetail || '',
          additionalParam: body.additionalParam || '',
          resultCode: body.resultCode,
          paymentCode: body.paymentCode || '',
          reference: body.reference || '',
          signature: body.signature,
        }

        // Process callback (updates order status and decreases stock)
        const result = await updateOrderFromCallback(callbackParams)

        if (result.success) {
          console.log('[DUITKU_CALLBACK] Successfully processed order:', body.merchantOrderId)
          return Response.json({
            success: true,
            message: 'Callback processed successfully',
          })
        } else {
          console.error('[DUITKU_CALLBACK] Failed to process callback:', result.error)
          return Response.json(
            {
              success: false,
              error: result.error,
            },
            { status: 400 },
          )
        }
      } catch (error) {
        console.error('[DUITKU_CALLBACK] Error processing webhook:', error)
        return Response.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process callback',
          },
          { status: 500 },
        )
      }
    }),
  },
]
