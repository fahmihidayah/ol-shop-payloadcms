'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getOrderByOrderNumberService } from '../services/get-by-order-number'
import { GetOrderResult } from '../types/order'

/**
 * Get order by order number (not ID)
 * @param orderNumber - Order number from URL
 * @returns Order data
 */
export async function getOrderByOrderNumber(orderNumber: string): Promise<GetOrderResult> {
  try {
    const payload = await getPayload({ config })

    const result = await getOrderByOrderNumberService({
      orderNumber: orderNumber,
      serviceContext: {
        payload,
        collection: 'orders',
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
