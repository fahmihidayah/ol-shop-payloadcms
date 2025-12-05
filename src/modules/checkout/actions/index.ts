'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getMeCustomer } from '@/actions/customer/getMeCustomer'
import { getCartItems, getOrCreateCart } from '@/modules/cart/actions'
import { getAddresses } from '@/modules/addresses/actions'
import { calculateCheckoutTotals } from '../utils/calculations'
import type { CheckoutSummary } from '../types/checkout-summary'
import { getSessionId } from '@/modules/cart/actions'
import { getSession } from '@/actions/getSession'
import { Address, Product } from '@/payload-types'

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
 * Get checkout summary with calculations
 */
export async function getCheckoutSummary(
  paymentOptionId?: string,
): Promise<{ success: boolean; data?: CheckoutSummary; message?: string }> {
  try {
    // Get cart items
    const { items: cartItems } = await getCartItems()

    if (cartItems.length === 0) {
      return {
        success: false,
        message: 'Cart is empty',
      }
    }

    // Get payment options
    const { paymentOptions } = await getPaymentOptions()

    // Get addresses
    const { addresses } = await getAddresses()

    // Get selected payment option if provided
    let selectedPaymentOption
    if (paymentOptionId) {
      selectedPaymentOption = paymentOptions.find((p) => String(p.id) === paymentOptionId)
    }

    // Get selected address from cart
    const payload = await getPayload({ config })
    const customerId = await getCurrentCustomerId()
    const sessionId = await getSessionId()

    let selectedAddressId: string | undefined

    if (customerId) {
      const cartResult = await payload.find({
        collection: 'carts',
        where: {
          customer: {
            equals: customerId,
          },
        },
        limit: 1,
      })

      if (cartResult.docs[0]?.address) {
        selectedAddressId =
          typeof cartResult.docs[0].address === 'string'
            ? cartResult.docs[0].address
            : cartResult.docs[0].address.id
      }
    } else if (sessionId) {
      const cartResult = await payload.find({
        collection: 'carts',
        where: {
          sessionId: {
            equals: sessionId,
          },
        },
        limit: 1,
      })

      if (cartResult.docs[0]?.address) {
        selectedAddressId =
          typeof cartResult.docs[0].address === 'string'
            ? cartResult.docs[0].address
            : cartResult.docs[0].address.id
      }
    }

    // Calculate totals
    const calculations = calculateCheckoutTotals(cartItems, selectedPaymentOption, {
      taxRate: 0.1, // 10% tax
      freeShippingThreshold: 500000,
      shippingFlatRate: 20000,
    })

    return {
      success: true,
      data: {
        cartItems,
        paymentOptions,
        addressOptions: addresses,
        selectedAddressId,
        calculations,
      },
    }
  } catch (error) {
    console.error('Get checkout summary error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get checkout summary',
    }
  }
}

/**
 * Select address for cart
 */
export async function selectAddress(
  addressId: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const payload = await getPayload({ config })
    const customerId = await getCurrentCustomerId()
    const sessionId = await getSessionId()

    // Require either authentication or session
    if (!customerId && !sessionId) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    // Verify address ownership
    const address = await payload.findByID({
      collection: 'addresses',
      id: addressId,
    })

    const addressCustomerId =
      typeof address.customer === 'string' ? address.customer : address.customer?.id
    const addressSessionId = address.sessionId

    const hasCustomerAccess = customerId && addressCustomerId === customerId
    const hasSessionAccess = sessionId && addressSessionId === sessionId

    if (!hasCustomerAccess && !hasSessionAccess) {
      return {
        success: false,
        message: 'Address not found',
      }
    }

    // Find cart
    let cart
    if (customerId) {
      const result = await payload.find({
        collection: 'carts',
        where: {
          customer: {
            equals: customerId,
          },
        },
        limit: 1,
      })
      cart = result.docs[0]
    } else if (sessionId) {
      const result = await payload.find({
        collection: 'carts',
        where: {
          sessionId: {
            equals: sessionId,
          },
        },
        limit: 1,
      })
      cart = result.docs[0]
    }

    if (!cart) {
      return {
        success: false,
        message: 'Cart not found',
      }
    }

    // Update cart with selected address
    await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        address: addressId,
      },
    })

    return {
      success: true,
      message: 'Address selected successfully',
    }
  } catch (error) {
    console.error('Select address error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to select address',
    }
  }
}

/**
 * Place order
 */
export async function placeOrder(
  paymentOptionId?: string,
): Promise<PlaceOrderResponse> {
  try {
    const payload = await getPayload({ config })
    const customerId = await getCurrentCustomerId()
    const sessionId = await getSessionId()
    const cart = await getOrCreateCart(customerId, sessionId)

    if (!cart.address) {
      return {
        success: false,
        message: 'You should choose an address',
      }
    }

    const address = cart.address as Address
    const cartData = await getCartItems()

    // Get payment option
    let paymentOption
    if (paymentOptionId) {
      paymentOption = await payload.findByID({
        collection: 'payment-options',
        id: paymentOptionId,
      })
    } else {
      // Get default active payment option
      const paymentResult = await payload.find({
        collection: 'payment-options',
        where: { isActive: { equals: true } },
        limit: 1,
      })
      paymentOption = paymentResult.docs[0]
    }

    if (!paymentOption) {
      return {
        success: false,
        message: 'No payment option available',
      }
    }

    // Calculate totals
    const totals = calculateCheckoutTotals(cartData.items, paymentOption as any, {
      taxRate: 0.1,
      freeShippingThreshold: 500000,
      shippingFlatRate: 20000,
    })

    // Create order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: customerId,
        orderNumber: '',
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
        totalAmount: totals.total,
        shippingCost: totals.shippingCost,
        discount: 0,
      },
    })

    // Create order items
    for (const item of cartData.items) {
      await payload.create({
        collection: 'order-items',
        data: {
          order: order.id,
          product: (item.product as Product).id,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        },
      })
    }

    // Create payment record
    await payload.create({
      collection: 'payments',
      data: {
        order: order.id,
        method: paymentOption.type,
        transactionId: `TXN-${Date.now()}`,
        status: 'pending',
        amount: totals.total,
        currency: 'IDR',
        notes: `Payment via ${paymentOption.name}`,
      },
    })

    // Clear cart items
    for (const item of cartData.items) {
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
