'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getMeCustomer } from '@/actions/customer/getMeCustomer'

interface PlaceOrderInput {
  addressId: string
  paymentOptionId: string
  items: Array<{
    id: string
    productId: string
    variant: string
    quantity: number
    price: number
    subtotal: number
  }>
  totals: {
    subtotal: number
    tax: number
    shippingCost: number
    processingFee: number
    total: number
  }
}

interface PlaceOrderResponse {
  success: boolean
  message?: string
  orderId?: string
}

/**
 * Get current customer ID
 */
async function getCurrentCustomerId(): Promise<string | undefined> {
  try {
    const { user } = await getMeCustomer()
    return user?.id
  } catch {
    return undefined
  }
}

/**
 * Get payment options
 */
export async function getPaymentOptions() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'payment-options',
      where: {
        isActive: {
          equals: true,
        },
      },
    })

    return {
      success: true,
      paymentOptions: result.docs,
    }
  } catch (error) {
    console.error('Get payment options error:', error)
    return {
      success: false,
      paymentOptions: [],
    }
  }
}

/**
 * Place order
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResponse> {
  try {
    const customerId = await getCurrentCustomerId()

    if (!customerId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const payload = await getPayload({ config })

    // Get address details
    const address = await payload.findByID({
      collection: 'addresses',
      id: input.addressId,
    })

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: customerId,
        shippingAddress: {
          recipientName: address.recipientName,
          phone: address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          province: address.province,
          postalCode: address.postalCode,
        },
        orderStatus: 'pending',
        paymentStatus: 'pending',
        totalAmount: input.totals.total,
        shippingCost: input.totals.shippingCost,
        discount: 0,
      },
    })

    // Create order items
    for (const item of input.items) {
      await payload.create({
        collection: 'order-items',
        data: {
          order: order.id,
          product: item.productId,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        },
      })
    }

    // Get payment option details
    const paymentOption = await payload.findByID({
      collection: 'payment-options',
      id: input.paymentOptionId,
    })

    // Create payment record
    await payload.create({
      collection: 'payments',
      data: {
        order: order.id,
        method: paymentOption.type,
        transactionId: `TXN-${Date.now()}`,
        status: 'pending',
        amount: input.totals.total,
        currency: 'IDR',
        notes: `Payment via ${paymentOption.name}`,
      },
    })

    // Clear cart items
    for (const item of input.items) {
      try {
        await payload.delete({
          collection: 'cart-items',
          id: item.id,
        })
      } catch (err) {
        console.error('Error deleting cart item:', err)
      }
    }

    return {
      success: true,
      message: 'Order placed successfully',
      orderId: order.id,
    }
  } catch (error) {
    console.error('Place order error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to place order',
    }
  }
}
