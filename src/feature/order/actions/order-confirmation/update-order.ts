'use server'

import { duitkuConfig } from '@/lib/duitku-config'
import type {
  DuitkuResultCode,
  DuitkuCallbackParams,
  UpdateOrderResult,
} from '@/feature/order/types/order'
import { getOrderByOrderNumber } from './get-order'
// import { verifyDuitkuSignatureService } from '../services/verify-signature'
// import { mapReturnUrlResultCode, mapCallbackResultCode } from '../utils/map-result-code'
import { updateOrderStatus } from './update-order-status'
// import { updateOrderFromReturnUrlService } from '../services/update-order-status'
import { getPayload } from 'payload'
import config from '@payload-config'
import { OrderService } from '../../services/order-service'
import { verifyDuitkuSignature } from '../../utils/verify-signature'
import { mapCallbackResultCode } from '../../utils/map-result-code'

/**
 * Update order status based on Duitku result code from return URL
 * This should be called when user returns from Duitku payment page
 *
 * Note: According to Duitku docs, we should NOT rely solely on resultCode
 * from return URL. This is just for user feedback.
 * Final status should be updated from callback.
 *
 * @param orderNumber - Order number from merchant
 * @param resultCode - Result code from Duitku (00=success, 01=pending, 02=canceled)
 * @param reference - Payment reference from Duitku
 * @returns Update result
 */
export async function updateOrderFromReturnUrl(
  orderNumber: string,
  resultCode: DuitkuResultCode,
  reference: string,
): Promise<UpdateOrderResult> {
  try {
    // Find order by order number
    const updateResult = await OrderService.updateOrderFromReturnUrl({
      serviceContext: {
        collection: 'orders',
        payload: await getPayload({
          config,
        }),
      },
      orderNumber,
      resultCode,
      reference,
    })
    return {
      success: true,
      order: updateResult.data,
    }
  } catch (error) {
    console.error('[UPDATE_ORDER_FROM_RETURN] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    }
  }
}

/**
 * Update order status from Duitku callback (webhook)
 * This is the authoritative update with signature verification
 *
 * @param params - Callback parameters from Duitku
 * @returns Update result
 */
export async function updateOrderFromCallback(
  params: DuitkuCallbackParams,
): Promise<UpdateOrderResult> {
  try {
    const { merchantCode, amount, merchantOrderId, reference, signature, resultCode } = params

    // Verify signature
    const isValid = await verifyDuitkuSignature(
      merchantCode,
      amount,
      merchantOrderId,
      duitkuConfig.apiKey,
      signature,
    )

    if (!isValid) {
      console.error('[CALLBACK] Invalid signature')
      return { success: false, error: 'Invalid signature' }
    }

    // Find order
    const orderResult = await getOrderByOrderNumber(merchantOrderId)
    if (!orderResult.success || !orderResult.order) {
      return { success: false, error: 'Order not found' }
    }

    const order = orderResult.order

    // Map callback result code to order status
    const { orderStatus, paymentStatus } = mapCallbackResultCode(resultCode)

    // Update order
    const updateResult = await updateOrderStatus(order.id, orderStatus, paymentStatus, reference)

    return updateResult
  } catch (error) {
    console.error('[UPDATE_ORDER_FROM_CALLBACK] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    }
  }
}
