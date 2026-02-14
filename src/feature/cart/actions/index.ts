'use server'

import { Cart, CartItem } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'

export interface CartWithItems extends Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

/**
 * Gets the current user's cart with all items and calculated totals
 */
export const getCart = async (): Promise<CartWithItems | null> => {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()

    let cart: Cart | null = null

    if (user) {
      // Logged-in user: find their active cart
      const existingCarts = await payload.find({
        collection: 'carts',
        where: {
          and: [
            {
              customer: {
                equals: user.id,
              },
            },
          ],
        },
        limit: 1,
      })

      if (existingCarts.docs.length > 0) {
        cart = existingCarts.docs[0] as Cart
      }
    } else {
      // Guest user: find cart by sessionId
      const sessionId = cookieStore.get('cart-session-id')?.value

      if (sessionId) {
        const existingCarts = await payload.find({
          collection: 'carts',
          where: {
            and: [
              {
                sessionId: {
                  equals: sessionId,
                },
              },
            ],
          },
          limit: 1,
        })

        if (existingCarts.docs.length > 0) {
          cart = existingCarts.docs[0] as Cart
        }
      }
    }

    if (!cart) {
      return null
    }

    // Fetch cart items with product details
    const cartItemsResult = await payload.find({
      collection: 'cart-items',
      where: {
        cart: {
          equals: cart.id,
        },
      },
      depth: 2, // Include product and variant details
    })

    const items = cartItemsResult.docs as CartItem[]

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0)

    return {
      ...cart,
      items,
      totalItems,
      totalPrice,
    }
  } catch (error) {
    console.error('[GET_CART] Error:', error)
    return null
  }
}

export const clearCartItems = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const cart = await getCart()
    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    const payload = await getPayload({
      config,
    })

    await payload.delete({
      collection: 'cart-items',
      where: {
        cart: {
          equals: cart.id,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[CLEAR_CART_ITEMS] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cart items',
    }
  }
}

/**
 * Deletes a cart item
 */
export const deleteCartItem = async (
  cartItemId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const payload = await getPayload({ config })

    // Delete the cart item
    await payload.delete({
      collection: 'cart-items',
      id: cartItemId,
    })

    // Revalidate cart data
    const { revalidateTag } = await import('next/cache')
    revalidateTag('cart')

    return { success: true }
  } catch (error) {
    console.error('[DELETE_CART_ITEM] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete cart item',
    }
  }
}

/**
 * Updates the quantity of a cart item
 */
export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number,
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (quantity < 1) {
      return { success: false, error: 'Quantity must be at least 1' }
    }

    const payload = await getPayload({ config })

    // Get the cart item to recalculate subtotal
    const cartItem = await payload.findByID({
      collection: 'cart-items',
      id: cartItemId,
    })

    if (!cartItem) {
      return { success: false, error: 'Cart item not found' }
    }

    // Update the cart item
    await payload.update({
      collection: 'cart-items',
      id: cartItemId,
      data: {
        quantity,
        subtotal: quantity * cartItem.price,
      },
    })

    // Revalidate cart data
    const { revalidateTag } = await import('next/cache')
    revalidateTag('cart')

    return { success: true }
  } catch (error) {
    console.error('[UPDATE_CART_ITEM_QUANTITY] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update quantity',
    }
  }
}
