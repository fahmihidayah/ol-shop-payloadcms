import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'
import { Cart, CartItem, Customer } from '@/payload-types'

/**
 * Extended Cart type with calculated totals
 */
export interface CartWithItems extends Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

/**
 * CartService - Handles all cart-related database operations
 *
 * This service provides methods for:
 * - Finding or creating carts for authenticated and guest users
 * - Fetching cart with items and calculated totals
 * - Managing cart items (update quantity, delete)
 * - Clearing cart items
 */
export const CartService = {
  /**
   * Finds or creates a cart for authenticated user
   *
   * @param serviceContext - Service context containing payload instance
   * @param userId - Customer ID
   * @returns Promise resolving to ServiceResult containing the Cart
   *
   * @example
   * ```typescript
   * const result = await CartService.findOrCreateUserCart({
   *   serviceContext: { collection: 'carts', payload },
   *   userId: 'customer-123'
   * })
   *
   * if (!result.error) {
   *   console.log('Cart ID:', result.data.id)
   * }
   * ```
   */
  findOrCreateUserCart: async ({
    serviceContext,
    userId,
  }: {
    serviceContext: ServiceContext
    userId: string
  }): Promise<ServiceResult<Cart>> => {
    // Find existing cart for user
    const existingCarts = await serviceContext.payload.find({
      collection: 'carts',
      where: {
        and: [
          {
            customer: {
              equals: userId,
            },
          },
        ],
      },
      limit: 1,
    })

    if (existingCarts.docs.length > 0) {
      return {
        data: existingCarts.docs[0] as Cart,
        error: false,
      }
    }

    // Create new cart for user
    const newCart = await serviceContext.payload.create({
      collection: 'carts',
      data: {
        customer: userId,
      },
    })

    return {
      data: newCart,
      error: false,
    }
  },

  /**
   * Finds or creates a cart for guest user by session ID
   *
   * @param serviceContext - Service context containing payload instance
   * @param sessionId - Session ID from cookie
   * @returns Promise resolving to ServiceResult containing the Cart
   *
   * @example
   * ```typescript
   * const result = await CartService.findOrCreateGuestCart({
   *   serviceContext: { collection: 'carts', payload },
   *   sessionId: 'session-abc-123'
   * })
   * ```
   */
  findOrCreateGuestCart: async ({
    serviceContext,
    sessionId,
  }: {
    serviceContext: ServiceContext
    sessionId: string
  }): Promise<ServiceResult<Cart>> => {
    // Find existing cart for session
    const existingCarts = await serviceContext.payload.find({
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
      return {
        data: existingCarts.docs[0] as Cart,
        error: false,
      }
    }

    // Create new cart for guest
    const newCart = await serviceContext.payload.create({
      collection: 'carts',
      data: {
        sessionId,
      },
    })

    return {
      data: newCart,
      error: false,
    }
  },

  /**
   * Finds cart by user ID (authenticated user)
   *
   * @param serviceContext - Service context containing payload instance
   * @param userId - Customer ID
   * @returns Promise resolving to ServiceResult containing the Cart or null
   *
   * @example
   * ```typescript
   * const result = await CartService.findCartByUser({
   *   serviceContext: { collection: 'carts', payload },
   *   userId: 'customer-123'
   * })
   * ```
   */
  findCartByUser: async ({
    serviceContext,
    userId,
  }: {
    serviceContext: ServiceContext
    userId: string
  }): Promise<ServiceResult<Cart | null>> => {
    const existingCarts = await serviceContext.payload.find({
      collection: 'carts',
      where: {
        and: [
          {
            customer: {
              equals: userId,
            },
          },
        ],
      },
      limit: 1,
    })

    if (existingCarts.docs.length === 0) {
      return {
        data: null,
        error: false,
      }
    }

    return {
      data: existingCarts.docs[0] as Cart,
      error: false,
    }
  },

  /**
   * Finds cart by session ID (guest user)
   *
   * @param serviceContext - Service context containing payload instance
   * @param sessionId - Session ID from cookie
   * @returns Promise resolving to ServiceResult containing the Cart or null
   *
   * @example
   * ```typescript
   * const result = await CartService.findCartBySession({
   *   serviceContext: { collection: 'carts', payload },
   *   sessionId: 'session-abc-123'
   * })
   * ```
   */
  findCartBySession: async ({
    serviceContext,
    sessionId,
  }: {
    serviceContext: ServiceContext
    sessionId: string
  }): Promise<ServiceResult<Cart | null>> => {
    const existingCarts = await serviceContext.payload.find({
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

    if (existingCarts.docs.length === 0) {
      return {
        data: null,
        error: false,
      }
    }

    return {
      data: existingCarts.docs[0] as Cart,
      error: false,
    }
  },

  /**
   * Gets cart items with product details
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartId - Cart ID
   * @returns Promise resolving to ServiceResult containing array of CartItems
   *
   * @example
   * ```typescript
   * const result = await CartService.getCartItems({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartId: 'cart-123'
   * })
   *
   * console.log(`Cart has ${result.data.length} items`)
   * ```
   */
  getCartItems: async ({
    serviceContext,
    cartId,
  }: {
    serviceContext: ServiceContext
    cartId: string
  }): Promise<ServiceResult<CartItem[]>> => {
    const cartItemsResult = await serviceContext.payload.find({
      collection: 'cart-items',
      where: {
        cart: {
          equals: cartId,
        },
      },
      depth: 2, // Include product and variant details
    })

    return {
      data: cartItemsResult.docs as CartItem[],
      error: false,
    }
  },

  /**
   * Gets cart with items and calculated totals
   *
   * This is a convenience method that combines cart lookup and items fetching.
   *
   * @param serviceContext - Service context containing payload instance
   * @param user - Optional authenticated user
   * @param sessionId - Optional session ID for guest users
   * @returns Promise resolving to ServiceResult containing CartWithItems or null
   *
   * @example
   * ```typescript
   * // For authenticated user
   * const result = await CartService.getCartWithItems({
   *   serviceContext: { collection: 'carts', payload },
   *   user: currentUser
   * })
   *
   * // For guest user
   * const result = await CartService.getCartWithItems({
   *   serviceContext: { collection: 'carts', payload },
   *   sessionId: 'session-abc-123'
   * })
   * ```
   */
  getCartWithItems: async ({
    serviceContext,
    user,
    sessionId,
  }: {
    serviceContext: ServiceContext
    user?: Customer
    sessionId?: string
  }): Promise<ServiceResult<CartWithItems | null>> => {
    let cart: Cart | null | undefined = null

    if (user) {
      // Find cart by user
      const cartResult = await CartService.findCartByUser({
        serviceContext,
        userId: user.id,
      })

      if (cartResult.error) {
        return {
          error: true,
          message: cartResult.message,
        }
      }

      cart = cartResult.data
    } else if (sessionId) {
      // Find cart by session
      const cartResult = await CartService.findCartBySession({
        serviceContext,
        sessionId,
      })

      if (cartResult.error) {
        return {
          error: true,
          message: cartResult.message,
        }
      }

      cart = cartResult.data
    }

    if (!cart) {
      return {
        data: null,
        error: false,
      }
    }

    // Fetch cart items
    const itemsResult = await CartService.getCartItems({
      serviceContext,
      cartId: cart.id,
    })

    if (itemsResult.error) {
      return {
        error: true,
        message: itemsResult.message,
      }
    }

    const items = itemsResult.data || []

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0)

    return {
      data: {
        ...cart,
        items,
        totalItems,
        totalPrice,
      },
      error: false,
    }
  },

  /**
   * Finds a cart item by cart and product/variant IDs
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartId - Cart ID
   * @param productId - Product ID
   * @param variantId - Variant ID
   * @returns Promise resolving to ServiceResult containing CartItem or null
   *
   * @example
   * ```typescript
   * const result = await CartService.findCartItem({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartId: 'cart-123',
   *   productId: 'prod-456',
   *   variantId: 'var-789'
   * })
   * ```
   */
  findCartItem: async ({
    serviceContext,
    cartId,
    productId,
    variantId,
  }: {
    serviceContext: ServiceContext
    cartId: string
    productId: string
    variantId: string
  }): Promise<ServiceResult<CartItem | null>> => {
    const existingCartItems = await serviceContext.payload.find({
      collection: 'cart-items',
      where: {
        and: [
          {
            cart: {
              equals: cartId,
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

    if (existingCartItems.docs.length === 0) {
      return {
        data: null,
        error: false,
      }
    }

    return {
      data: existingCartItems.docs[0] as CartItem,
      error: false,
    }
  },

  /**
   * Creates a new cart item
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartId - Cart ID
   * @param productId - Product ID
   * @param variantId - Variant ID
   * @param quantity - Quantity
   * @param price - Unit price
   * @returns Promise resolving to ServiceResult containing the created CartItem
   *
   * @example
   * ```typescript
   * const result = await CartService.createCartItem({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartId: 'cart-123',
   *   productId: 'prod-456',
   *   variantId: 'var-789',
   *   quantity: 2,
   *   price: 50000
   * })
   * ```
   */
  createCartItem: async ({
    serviceContext,
    cartId,
    productId,
    variantId,
    quantity,
    price,
  }: {
    serviceContext: ServiceContext
    cartId: string
    productId: string
    variantId: string
    quantity: number
    price: number
  }): Promise<ServiceResult<CartItem>> => {
    const cartItem = await serviceContext.payload.create({
      collection: 'cart-items',
      data: {
        cart: cartId,
        product: productId,
        variant: variantId,
        quantity,
        price,
        subtotal: quantity * price,
      },
    })

    return {
      data: cartItem,
      error: false,
    }
  },

  /**
   * Updates cart item quantity
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartItemId - Cart item ID
   * @param quantity - New quantity
   * @returns Promise resolving to ServiceResult containing updated CartItem
   *
   * @example
   * ```typescript
   * const result = await CartService.updateCartItemQuantity({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartItemId: 'item-123',
   *   quantity: 5
   * })
   * ```
   */
  updateCartItemQuantity: async ({
    serviceContext,
    cartItemId,
    quantity,
  }: {
    serviceContext: ServiceContext
    cartItemId: string
    quantity: number
  }): Promise<ServiceResult<CartItem>> => {
    if (quantity < 1) {
      return {
        error: true,
        message: 'Quantity must be at least 1',
      }
    }

    // Get the cart item to recalculate subtotal
    const cartItem = await serviceContext.payload.findByID({
      collection: 'cart-items',
      id: cartItemId,
    })

    if (!cartItem) {
      return {
        error: true,
        message: 'Cart item not found',
      }
    }

    // Update the cart item
    const updatedItem = await serviceContext.payload.update({
      collection: 'cart-items',
      id: cartItemId,
      data: {
        quantity,
        subtotal: quantity * cartItem.price,
      },
    })

    return {
      data: updatedItem,
      error: false,
    }
  },

  /**
   * Updates existing cart item quantity (add to existing)
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartItemId - Cart item ID
   * @param additionalQuantity - Quantity to add
   * @param price - Current unit price
   * @returns Promise resolving to ServiceResult containing updated CartItem
   *
   * @example
   * ```typescript
   * const result = await CartService.updateExistingCartItem({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartItemId: 'item-123',
   *   additionalQuantity: 2,
   *   price: 50000
   * })
   * ```
   */
  updateExistingCartItem: async ({
    serviceContext,
    cartItemId,
    additionalQuantity,
    price,
  }: {
    serviceContext: ServiceContext
    cartItemId: string
    additionalQuantity: number
    price: number
  }): Promise<ServiceResult<CartItem>> => {
    // Get the existing cart item
    const existingItem = await serviceContext.payload.findByID({
      collection: 'cart-items',
      id: cartItemId,
    })

    if (!existingItem) {
      return {
        error: true,
        message: 'Cart item not found',
      }
    }

    const newQuantity = existingItem.quantity + additionalQuantity

    // Update with new quantity
    const updatedItem = await serviceContext.payload.update({
      collection: 'cart-items',
      id: cartItemId,
      data: {
        quantity: newQuantity,
        price: price, // Update price in case it changed
      },
    })

    return {
      data: updatedItem,
      error: false,
    }
  },

  /**
   * Deletes a cart item
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartItemId - Cart item ID to delete
   * @returns Promise resolving to ServiceResult
   *
   * @example
   * ```typescript
   * const result = await CartService.deleteCartItem({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartItemId: 'item-123'
   * })
   * ```
   */
  deleteCartItem: async ({
    serviceContext,
    cartItemId,
  }: {
    serviceContext: ServiceContext
    cartItemId: string
  }): Promise<ServiceResult<void>> => {
    await serviceContext.payload.delete({
      collection: 'cart-items',
      id: cartItemId,
    })

    return {
      error: false,
    }
  },

  /**
   * Clears all items from a cart
   *
   * @param serviceContext - Service context containing payload instance
   * @param cartId - Cart ID
   * @returns Promise resolving to ServiceResult
   *
   * @example
   * ```typescript
   * const result = await CartService.clearCartItems({
   *   serviceContext: { collection: 'cart-items', payload },
   *   cartId: 'cart-123'
   * })
   * ```
   */
  clearCartItems: async ({
    serviceContext,
    cartId,
  }: {
    serviceContext: ServiceContext
    cartId: string
  }): Promise<ServiceResult<void>> => {
    await serviceContext.payload.delete({
      collection: 'cart-items',
      where: {
        cart: {
          equals: cartId,
        },
      },
    })

    return {
      error: false,
    }
  },
}
