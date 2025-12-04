'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CartItem } from '@/payload-types'
import { getMeCustomer } from '@/actions/customer/getMeCustomer'

export interface CartData {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface AddToCartInput {
  productId: string
  variantId: string
  quantity: number
  price: number
}

export interface AddToCartResponse {
  success: boolean
  message?: string
  cartItemId?: string
}

/**
 * Get or create a cart for the current user/session
 */
export async function getOrCreateCart(customerId?: string, sessionId?: string) {
  const payload = await getPayload({ config })

  // Try to find existing cart
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

  // Create new cart if none exists
  if (!cart) {
    const newSessionId = sessionId || crypto.randomUUID()
    cart = await payload.create({
      collection: 'carts',
      data: {
        customer: customerId,
        sessionId: newSessionId,
      },
    })

    // Set session cookie for guest users
    if (!customerId) {
      const cookieStore = await cookies()
      cookieStore.set('cart-session-id', newSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
    }
  }

  return cart
}

/**
 * Get current customer ID from session
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
 * Get cart session ID from cookies
 */
export async function getSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('cart-session-id')?.value
}

/**
 * create cart session Id
 * @returns
 */

export async function createSessionId(): Promise<string | undefined> {
  const newSessionId = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('cart-session-id', newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return newSessionId
}

/**
 * Get cart items for current user/session
 */
export async function getCartItems(): Promise<CartData> {
  try {
    const payload = await getPayload({ config })

    // Get cart ID
    const customerId = await getCurrentCustomerId()
    const sessionId = await getSessionId()

    if (!customerId && !sessionId) {
      return { items: [], totalItems: 0, totalPrice: 0 }
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
      return { items: [], totalItems: 0, totalPrice: 0 }
    }

    // Fetch cart items with product details
    const cartItemsResult = await payload.find({
      collection: 'cart-items',
      where: {
        cart: {
          equals: cart.id,
        },
      },
      depth: 2, // Include product details
    })

    // Transform cart items
    const items: CartItem[] = cartItemsResult.docs
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0)

    return { items, totalItems, totalPrice }
  } catch (error) {
    console.error('Error fetching cart items:', error)
    return { items: [], totalItems: 0, totalPrice: 0 }
  }
}

/**
 * Add item to cart
 */
export async function addToCart(input: AddToCartInput): Promise<AddToCartResponse> {
  try {
    const payload = await getPayload({ config })

    // Validate product and variant exist
    const product = await payload.findByID({
      collection: 'products',
      id: input.productId,
    })

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      }
    }

    // Verify variant exists and has stock
    const variants = (product as any)['product-variant'] || []
    const variant = variants.find((v: any) => v.id === input.variantId)

    if (!variant) {
      return {
        success: false,
        message: 'Product variant not found',
      }
    }

    if (variant.stockQuantity < input.quantity) {
      return {
        success: false,
        message: `Only ${variant.stockQuantity} items available in stock`,
      }
    }

    // Get or create cart
    const customerId = await getCurrentCustomerId()
    const sessionId = await getSessionId()
    const cart = await getOrCreateCart(customerId, sessionId)

    // Check if item already exists in cart
    const existingItems = await payload.find({
      collection: 'cart-items',
      where: {
        and: [
          {
            cart: {
              equals: cart.id,
            },
          },
          {
            product: {
              equals: input.productId,
            },
          },
          {
            variant: {
              equals: input.variantId,
            },
          },
        ],
      },
      limit: 1,
    })

    const existingItem = existingItems.docs[0]

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + input.quantity

      // Check stock again with new quantity
      if (variant.stockQuantity < newQuantity) {
        return {
          success: false,
          message: `Cannot add more items. Only ${variant.stockQuantity} available in stock`,
        }
      }

      await payload.update({
        collection: 'cart-items',
        id: existingItem.id,
        data: {
          quantity: newQuantity,
          price: input.price, // Update price in case it changed
        },
      })

      return {
        success: true,
        message: 'Cart updated successfully',
        cartItemId: existingItem.id,
      }
    } else {
      // Create new cart item
      const cartItem = await payload.create({
        collection: 'cart-items',
        data: {
          cart: cart.id,
          product: input.productId,
          variant: input.variantId,
          quantity: input.quantity,
          price: input.price,
          subtotal: input.quantity * input.price,
        },
      })

      return {
        success: true,
        message: 'Item added to cart successfully',
        cartItemId: cartItem.id,
      }
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return {
      success: false,
      message: 'Failed to add item to cart. Please try again.',
    }
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  cartItemId: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const payload = await getPayload({ config })

    await payload.delete({
      collection: 'cart-items',
      id: cartItemId,
    })

    return {
      success: true,
      message: 'Item removed from cart',
    }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return {
      success: false,
      message: 'Failed to remove item from cart',
    }
  }
}
