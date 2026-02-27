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
import { getMeUser } from '@/lib/customer-utils'
import { cookies } from 'next/headers'
import { ProductService } from '@/feature/products/services/product-service'

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
    const user = await getMeUser()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart-session-id')?.value
    const payload = await getPayload({ config })

    const updateResult = await OrderService.updateOrderFromReturnUrl({
      serviceContext: {
        payload,
        user: user.user,
        sessionId,
      },
      orderNumber,
      resultCode,
      reference,
    })

    // NOTE: Stock decrement is NOT done here!
    // According to Duitku docs, return URL should not be relied upon for final status.
    // The callback webhook is the authoritative source and will be triggered separately by Duitku.
    // Stock will be decremented ONLY in updateOrderFromCallback() when Duitku's webhook fires.
    //
    // DO NOT manually call updateOrderFromCallback here because:
    // 1. We don't have a valid signature (only Duitku has it)
    // 2. Duitku will call the callback webhook separately
    // 3. Manual call would bypass signature verification (security risk)
    // 4. Could cause timing issues or duplicate processing

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
    const updateResult = await updateOrderStatus(
      order.orderNumber,
      orderStatus,
      paymentStatus,
      reference,
    )

    // Decrease product stock ONLY in callback (authoritative source)
    // This is the only place where stock should be decremented to prevent double decrement
    if (updateResult.success && updateResult.order && paymentStatus === 'paid') {
      try {
        const payload = await getPayload({ config })

        // Fetch order items for this order
        const orderItems = await payload.find({
          collection: 'order-items',
          where: {
            order: {
              equals: updateResult.order.id,
            },
          },
          depth: 2,
        })

        // Decrease stock for each order item
        const stockDecreasePromises = orderItems.docs.map((orderItem) => {
          return ProductService.decreaseProductStock({
            context: { payload },
            orderItem,
          })
        })

        // Execute all stock decrements in parallel
        await Promise.all(stockDecreasePromises)

        console.log(`[CALLBACK] Successfully decreased stock for order ${merchantOrderId}`)
      } catch (stockError) {
        // Log error but don't fail the callback
        console.error(
          `[CALLBACK] Failed to decrease stock for order ${merchantOrderId}:`,
          stockError,
        )
      }
    }

    return updateResult
  } catch (error) {
    console.error('[UPDATE_ORDER_FROM_CALLBACK] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order',
    }
  }
}
