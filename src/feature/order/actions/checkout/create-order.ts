'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { CheckoutData, CreateOrderResult } from '@/types/checkout'
import { revalidateTag } from 'next/cache'
import { OrderService } from '../../services/order-service'
import { getMeUser } from '@/lib/customer-utils'
import { cookies } from 'next/headers'

/**
 * Create order and order items in the database
 * This should be done BEFORE initiating payment to ensure we have a valid order
 * @param checkoutData - Checkout information
 * @returns Order creation result with order ID
 */
export async function createOrder(checkoutData: CheckoutData): Promise<CreateOrderResult> {
  try {
    const payload = await getPayload({ config })

    const orderResult = await OrderService.create({
      context: {
        payload,
        user: checkoutData.user,
        sessionId: checkoutData.sessionId,
      },
      checkoutData,
    })

    if (orderResult.error) {
      return {
        success: false,
        error: orderResult.message || 'Failed to create order',
      }
    }

    // Revalidate orders cache
    revalidateTag('orders')

    return {
      success: true,
      order: orderResult.data,
      orderId: orderResult.data?.id,
    }
  } catch (error) {
    console.error('[CREATE_ORDER] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    }
  }
}

/**
 * Update order payment status
 * @param orderId - Order ID
 * @param paymentReference - Payment reference from Duitku
 * @param vaNumber - Virtual account number (if applicable)
 * @returns Update result
 */
export async function updateOrderPayment(
  orderId: string,
  paymentReference: string,
  vaNumber?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })

    const result = await OrderService.updatePaymentReference({
      serviceContext: {
        payload,
      },
      orderId,
      paymentReference,
      vaNumber,
    })

    if (result.error) {
      return {
        success: false,
        error: result.message || 'Failed to update order payment',
      }
    }

    revalidateTag('orders')

    return { success: true }
  } catch (error) {
    console.error('[UPDATE_ORDER_PAYMENT] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order payment',
    }
  }
}

/**
 * Update order status after successful payment
 * @param orderId - Order ID
 * @param orderStatus - New order status
 * @param paymentStatus - New payment status
 * @returns Update result
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = await getPayload({ config })

    const result = await OrderService.updateOrderStatus({
      serviceContext: {
        payload,
      },
      orderId,
      orderStatus,
      paymentStatus,
    })

    if (result.error) {
      return {
        success: false,
        error: result.message || 'Failed to update order status',
      }
    }

    revalidateTag('orders')

    return { success: true }
  } catch (error) {
    console.error('[UPDATE_ORDER_STATUS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status',
    }
  }
}
