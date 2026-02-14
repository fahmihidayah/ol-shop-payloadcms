'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { CheckoutData, CheckoutItem, CreateOrderResult } from '@/types/checkout'
import { revalidateTag } from 'next/cache'
import { getCart } from '@/feature/cart/actions'

/**
 * Generate unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `ORD-${timestamp}-${random}`
}

/**
 * Create order and order items in the database
 * This should be done BEFORE initiating payment to ensure we have a valid order
 * @param checkoutData - Checkout information
 * @returns Order creation result with order ID
 */
export async function createOrder(checkoutData: CheckoutData): Promise<CreateOrderResult> {
  try {
    const payload = await getPayload({ config })

    const cart = await getCart()

    // Generate unique order number
    const orderNumber = generateOrderNumber()

    // Create the order first
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customer: checkoutData.customerId,
        orderStatus: 'pending', // Initial status - waiting for payment
        paymentStatus: 'pending',
        paymentMethod: checkoutData.paymentMethod,

        // Pricing
        totalAmount: checkoutData.total,
        shippingCost: checkoutData.shippingCost,

        // Shipping address
        shippingAddress: {
          recipientName: checkoutData.shippingAddress.fullName,
          phone: checkoutData.shippingAddress.phone,
          addressLine1: checkoutData.shippingAddress.address,
          city: checkoutData.shippingAddress.city,
          province: checkoutData.shippingAddress.state ?? '',
          postalCode: checkoutData.shippingAddress.postalCode,
          country: checkoutData.shippingAddress.country || 'ID',
        },

        // Notes
        notes: checkoutData.notes,
      },
    })

    // Create order items
    const orderItemsPromises = checkoutData.items.map((item: CheckoutItem) =>
      payload.create({
        collection: 'order-items',
        data: {
          order: order.id,
          product: item.productId,
          variant: item.variantId,
          productSnapshot: {
            title: item.productName,
            variantTitle: item.variantName,
          },
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        },
      }),
    )

    await Promise.all(orderItemsPromises)

    // Revalidate orders cache
    revalidateTag('orders')

    return {
      success: true,
      order,
      orderId: order.id,
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

    const updateData: any = {
      paymentReference,
    }

    if (vaNumber) {
      updateData.vaNumber = vaNumber
    }

    await payload.update({
      collection: 'orders',
      id: orderId,
      data: updateData,
    })

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
 * @param status - New order status
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

    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        orderStatus,
        paymentStatus,
      },
    })

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
