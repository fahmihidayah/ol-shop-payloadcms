import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  getCartItems,
} from '@/modules/cart/actions'
import type { Media, CartItem as PayloadCartItem, Product } from '@/payload-types'

// CartItem type for the store - extends PayloadCMS type with UI-specific fields
// PayloadCMS CartItem has: cart (relation), product (relation), but we need denormalized data for UI
export type CartItem = Pick<
  PayloadCartItem,
  'id' | 'variant' | 'quantity' | 'price' | 'subtotal' | 'product'
> & {
  // UI-specific denormalized fields
  productId: string
  productTitle: string
  productImage?: string
  productSlug?: string
  stock: number
}

interface CartState {
  // State
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  lastSyncedAt: number | null

  // Computed values
  totalItems: number
  totalPrice: number

  // Actions
  addProduct: (product: Product, variantId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  syncWithServer: () => Promise<void>

  // Internal helpers
  _setItems: (items: CartItem[]) => void
  _setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      isLoading: false,
      lastSyncedAt: null,
      totalItems: 0,
      totalPrice: 0,
      addProduct: async (product, variantId, quantity) => {
        const variant = product['product-variant']?.find((v) => v.id === variantId)
        if (!variant) {
          throw new Error('Variant not found')
        }

        await addToCartAction({
          productId: product.id,
          variantId,
          quantity,
          price: variant.price,
        })

        const cartData = await getCartItems()
        const transformedItems: CartItem[] = cartData.items.map((serverItem) => {
          const product =
            typeof serverItem.product === 'object' && serverItem.product !== null
              ? serverItem.product
              : null

          return {
            id: serverItem.id,
            variant: serverItem.variant,
            quantity: serverItem.quantity,
            price: serverItem.price,
            subtotal: serverItem.subtotal,
            product: serverItem.product,
            // UI-specific fields
            productId: product?.id || '',
            productTitle: product?.title || '',
            productImage: (product?.thumbnail as Media)?.url || '',
            productSlug: product?.slug || '',
            stock:
              (product as any)?.['product-variant']?.find((v: any) => v.id === serverItem.variant)
                ?.stockQuantity || 0,
          }
        })

        // Update state with server data
        set({
          items: transformedItems,
          totalItems: cartData.totalItems,
          totalPrice: cartData.totalPrice,
          lastSyncedAt: Date.now(),
        })
      },

      // Remove item from cart
      removeItem: async (itemId) => {
        const itemToRemove = get().items.find((i) => i.id === itemId)
        if (!itemToRemove) return

        set({ isLoading: true })

        try {
          // Optimistic update - remove locally first
          set((state) => ({
            items: state.items.filter((i) => i.id !== itemId),
          }))

          // Update computed values
          const items = get().items
          set({
            totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
          })

          // Sync with server
          const result = await removeFromCartAction(itemId)

          if (!result.success) {
            // Rollback on error
            set((state) => ({
              items: [...state.items, itemToRemove].sort((a, b) => a.id.localeCompare(b.id)),
            }))

            // Recalculate
            const items = get().items
            set({
              totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
              totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
            })

            throw new Error(result.message || 'Failed to remove item from cart')
          }

          set({ lastSyncedAt: Date.now() })
        } catch (error) {
          console.error('Error removing item from cart:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Update item quantity
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity, subtotal: quantity * item.price } : item,
          ),
        }))

        // Update computed values
        const items = get().items
        set({
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
        })
      },

      // Clear cart
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          lastSyncedAt: Date.now(),
        })
      },

      // Cart UI controls
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Sync with server (fetch current cart state)
      syncWithServer: async () => {
        // This will be implemented when we need to fetch cart from server
        // For now, we rely on optimistic updates
        set({ lastSyncedAt: Date.now() })
      },

      // Internal helpers
      _setItems: (items) => {
        set({
          items,
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
        })
      },
      _setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
)

// Selectors for better performance
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartTotalItems = () => useCartStore((state) => state.totalItems)
export const useCartTotalPrice = () => useCartStore((state) => state.totalPrice)
export const useCartIsOpen = () => useCartStore((state) => state.isOpen)
export const useCartIsLoading = () => useCartStore((state) => state.isLoading)
