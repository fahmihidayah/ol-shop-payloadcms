'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getMeUser } from '@/lib/customer-utils'
import { OrderService } from '@/feature/order/services/order-service'
import { cookies } from 'next/headers'

/**
 * Gets order statistics for the current user
 */
export const getOrderStatistics = async (): Promise<{
  total: number
  pending: number
  completed: number
  cancelled: number
}> => {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookiesStore = await cookies()
    const sessionId = cookiesStore.get('cart-session-id')?.value

    if (!user) {
      return {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
      }
    }

    // Get all orders for the user
    // const ordersResult = await payload.find({
    //   collection: 'orders',
    //   where: {
    //     customer: {
    //       equals: user.id,
    //     },
    //   },
    //   limit: 0, // Get all orders
    // })

    const orderResult = await OrderService.findAll({
      context: {
        payload,
        user,
        sessionId,
      },
    })

    const orders = orderResult.docs

    // Calculate statistics
    const stats = {
      total: orders.length,
      pending: orders.filter((order) => order.orderStatus === 'pending').length,
      completed: orders.filter((order) => order.orderStatus === 'delivered').length,
      cancelled: orders.filter((order) => order.orderStatus === 'cancelled').length,
    }

    return stats
  } catch (error) {
    console.error('[GET_ORDER_STATISTICS] Error:', error)
    return {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    }
  }
}
