'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { GetOrderResult } from '../../types/order'
import { OrderService } from '../../services/order-service'

/**
 * Get order by order number (not ID)
 * @param orderNumber - Order number from URL
 * @returns Order data
 */
export async function getOrderByOrderNumber(orderNumber: string): Promise<GetOrderResult> {
  try {
    const payload = await getPayload({ config })

    const result = await OrderService.findByOrderNumber({
      orderNumber: orderNumber,
      serviceContext: {
        payload,
      },
    })
    return { success: true, order: result.data }
  } catch (error) {
    console.error('[GET_ORDER_BY_NUMBER] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get order',
    }
  }
}
