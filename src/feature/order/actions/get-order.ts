'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { GetOrderResult } from '@/types/order'

/**
 * Get order by order number (not ID)
 * @param orderNumber - Order number from URL
 * @returns Order data
 */
export async function getOrderByOrderNumber(orderNumber: string): Promise<GetOrderResult> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: orderNumber,
        },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return { success: false, error: 'Order not found' }
    }

    return { success: true, order: result.docs[0] }
  } catch (error) {
    console.error('[GET_ORDER_BY_NUMBER] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get order',
    }
  }
}
