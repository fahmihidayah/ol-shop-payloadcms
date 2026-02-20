'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { OrderStatus, PaymentStatus, UpdateOrderResult } from '@/feature/order/types/order'
import { OrderService } from '../../services/order-service'
// import { updateOrderStatusService } from '../services/update-order-status'

/**
 * Update order status in database
 * @param orderId - Order ID (not order number)
 * @param orderStatus - New order status
 * @param paymentStatus - New payment status
 * @param paymentReference - Payment reference from Duitku
 * @returns Update result
 */
export async function updateOrderStatus(
  orderNumber: string,
  orderStatus: OrderStatus,
  paymentStatus: PaymentStatus,
  paymentReference?: string,
): Promise<UpdateOrderResult> {
  try {
    const payload = await getPayload({ config })

    const result = await OrderService.updateOrderStatus({
      serviceContext: {
        payload: payload,
      },
      orderNumber,
      orderStatus,
      paymentStatus,
      paymentReference,
    })

    return { success: true, order: result.data }
  } catch (error) {
    console.error('[UPDATE_ORDER_STATUS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status',
    }
  }
}
