'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { OrderService } from '../../services/order-service'
import { Order, OrderItem } from '@/payload-types'
import { getMeUser } from '@/lib/customer-utils'

interface OrderDetailResult {
  order: Order
  orderItems: OrderItem[]
}

/**
 * Get order details with order items
 *
 * @param orderId - The order ID to retrieve
 * @returns Order with its items, or null if not found or unauthorized
 */
export async function getOrderDetail(orderId: string): Promise<OrderDetailResult | null> {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()

    // Fetch order
    const orderResult = await OrderService.findById({
      serviceContext: { payload },
      orderId,
    })

    if (orderResult.error || !orderResult.data) {
      console.error('[GET_ORDER_DETAIL] Order not found:', orderId)
      return null
    }

    const order = orderResult.data

    // Authorization: Check if user owns this order
    // For authenticated users, check customer ID
    // For guest users, we could check sessionId (but it's less secure)
    if (user) {
      const customerId = typeof order.customer === 'string' ? order.customer : order.customer?.id
      if (customerId !== user.id) {
        console.error('[GET_ORDER_DETAIL] Unauthorized access attempt:', {
          userId: user.id,
          customerId,
        })
        return null
      }
    }

    // Fetch order items
    const orderItemsResult = await payload.find({
      collection: 'order-items',
      where: {
        order: {
          equals: orderId,
        },
      },
      depth: 2, // Populate product details
      limit: 0, // Get all items
    })

    return {
      order,
      orderItems: orderItemsResult.docs,
    }
  } catch (error) {
    console.error('[GET_ORDER_DETAIL] Error:', error)
    return null
  }
}
