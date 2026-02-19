'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'
import { revalidateTag } from 'next/cache'
import { CartService, CartWithItems } from '../services/cart-service'

/**
 * Gets the current user's cart with all items and calculated totals
 */
export const getCart = async (): Promise<CartWithItems | null> => {
  try {
    const payload = await getPayload({ config })
    const { user } = await getMeUser()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart-session-id')?.value

    const result = await CartService.getCartWithItems({
      serviceContext: {
        payload,
      },
      user,
      sessionId,
    })

    if (result.error) {
      console.error('[GET_CART] Error:', result.message)
      return null
    }

    return result.data ?? null
  } catch (error) {
    console.error('[GET_CART] Error:', error)
    return null
  }
}

/**
 * Clears all items from the current user's cart
 */
export const clearCartItems = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const cart = await getCart()
    if (!cart) {
      return { success: false, error: 'Cart not found' }
    }

    const payload = await getPayload({ config })

    const result = await CartService.clearCartItems({
      serviceContext: {
        payload,
      },
      cartId: cart.id,
    })

    if (result.error) {
      return {
        success: false,
        error: result.message || 'Failed to clear cart items',
      }
    }

    revalidateTag('cart')
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

    const result = await CartService.deleteCartItem({
      serviceContext: {
        payload,
      },
      cartItemId,
    })

    if (result.error) {
      return {
        success: false,
        error: result.message || 'Failed to delete cart item',
      }
    }

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
    const payload = await getPayload({ config })

    const result = await CartService.updateCartItemQuantity({
      serviceContext: {
        payload,
      },
      cartItemId,
      quantity,
    })

    if (result.error) {
      return {
        success: false,
        error: result.message || 'Failed to update quantity',
      }
    }

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

/**
 * Revalidates cart cache
 */
export const revalidateCart = async () => {
  revalidateTag('cart')
}

// Re-export the CartWithItems type for convenience
export type { CartWithItems } from '../services/cart-service'
