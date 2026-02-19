'use server'

import { Cart } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { getMeUser } from '@/lib/customer-utils'
import { revalidateTag } from 'next/cache'
import { ProductService } from '../services/product-service'

export const addToCart = async ({
  productId,
  variantId,
  quantity = 1,
}: {
  productId: string
  variantId: string
  quantity?: number
}): Promise<{
  success: boolean
  error?: string
  cartId?: string
}> => {
  try {
    const payload = await getPayload({ config })

    // Step 1: Validate product exists and is active
    const productResult = await ProductService.validateProduct({
      serviceContext: {
        payload,
      },
      productId,
    })

    if (productResult.error) {
      return {
        success: false,
        error: productResult.message,
      }
    }

    const product = productResult.data!

    // Step 2: Validate variant exists, is active, and has sufficient stock
    const variantResult = ProductService.validateVariant({
      product,
      variantId,
      requestedQuantity: quantity,
    })

    if (variantResult.error) {
      return {
        success: false,
        error: variantResult.message,
      }
    }

    const variant = variantResult.data

    // Step 3: Get or create cart based on user authentication
    const { user } = await getMeUser()
    let cart: Cart | null = null
    const cookieStore = await cookies()

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
      } else {
        // Create new cart for logged-in user
        cart = await payload.create({
          collection: 'carts',
          data: {
            customer: user.id,
          },
        })
      }
    } else {
      // Guest user: get or create sessionId
      let sessionId = cookieStore.get('cart-session-id')?.value

      if (!sessionId) {
        sessionId = `session-${crypto.randomUUID()}`
        cookieStore.set('cart-session-id', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        })
      }

      // Find cart by sessionId
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
      } else {
        // Create new cart for guest user
        cart = await payload.create({
          collection: 'carts',
          data: {
            sessionId,
          },
        })
      }
    }

    if (!cart) {
      return {
        success: false,
        error: 'Failed to create or retrieve cart',
      }
    }

    // Step 4: Check if item already exists in cart
    const existingCartItems = await payload.find({
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
              equals: productId,
            },
          },
          {
            variant: {
              equals: variantId,
            },
          },
        ],
      },
      limit: 1,
    })

    if (existingCartItems.docs.length > 0) {
      // Update existing cart item
      const existingItem = existingCartItems.docs[0]
      const newQuantity = existingItem.quantity + quantity

      // Re-validate stock for new quantity
      const newQuantityValidation = ProductService.validateVariant({
        product,
        variantId,
        requestedQuantity: newQuantity,
      })

      if (newQuantityValidation.error) {
        return {
          success: false,
          error: newQuantityValidation.message,
        }
      }

      await payload.update({
        collection: 'cart-items',
        id: existingItem.id,
        data: {
          quantity: newQuantity,
          price: variant.price,
        },
      })
    } else {
      // Create new cart item
      await payload.create({
        collection: 'cart-items',
        data: {
          cart: cart.id,
          product: productId,
          variant: variantId,
          quantity,
          price: variant.price,
          subtotal: quantity * variant.price,
        },
      })
    }

    // Step 5: Revalidate cart-related data
    revalidateTag('cart')
    revalidateTag(`cart-${cart.id}`)

    return {
      success: true,
      cartId: cart.id,
    }
  } catch (error) {
    console.error('[ADD_TO_CART] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add item to cart',
    }
  }
}
