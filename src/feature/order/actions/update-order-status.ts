'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidateTag } from 'next/cache'
import type { OrderStatus, PaymentStatus, UpdateOrderResult } from '@/types/order'
import { clearCartItems } from '@/feature/cart/actions'

/**
 * Update order status in database
 * @param orderId - Order ID (not order number)
 * @param orderStatus - New order status
 * @param paymentStatus - New payment status
 * @param paymentReference - Payment reference from Duitku
 * @returns Update result
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  paymentStatus: PaymentStatus,
  paymentReference?: string,
): Promise<UpdateOrderResult> {
  try {
    const payload = await getPayload({ config })

    const updateData: any = {
      orderStatus,
      paymentStatus,
    }

    if (paymentReference) {
      updateData.paymentReference = paymentReference
    }

    const updatedOrder = await payload.update({
      collection: 'orders',
      id: orderId,
      data: updateData,
    })

    // Clear cart items if payment is successful
    if (paymentStatus === 'paid') {
      await clearCartItems()
      revalidateTag('cart')
    }

    revalidateTag('orders')

    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('[UPDATE_ORDER_STATUS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status',
    }
  }
}
