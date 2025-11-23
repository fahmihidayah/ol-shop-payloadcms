import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
} from '@/modules/cart/actions'
import type { CartItem as PayloadCartItem } from '@/payload-types'

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
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => Promise<void>
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

      // Add item to cart
      addItem: async (item) => {
        set({ isLoading: true })

        try {
          // Check if item already exists
          const existingItem = get().items.find(
            (i) => i.productId === item.productId && i.variant === item.variant,
          )

          if (existingItem) {
            // Update quantity if item exists
            const newQuantity = existingItem.quantity + item.quantity

            // Check stock
            if (newQuantity > item.stock) {
              throw new Error(`Only ${item.stock} items available in stock`)
            }

            // Update locally first (optimistic update)
            set((state) => ({
              items: state.items.map((i) =>
                i.productId === item.productId && i.variant === item.variant
                  ? { ...i, quantity: newQuantity, subtotal: newQuantity * i.price }
                  : i,
              ),
            }))
          } else {
            // Add new item
            const newItem: CartItem = {
              ...item,
              id: `temp-${Date.now()}`, // Temporary ID
              subtotal: item.quantity * item.price,
            }

            set((state) => ({
              items: [...state.items, newItem],
            }))
          }

          // Update computed values
          const items = get().items
          set({
            totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: items.reduce((sum, item) => sum + item.subtotal, 0),
          })

          // Sync with server in background
          const result = await addToCartAction({
            productId: item.productId,
            variantId: item.variant, // Use variant field
            quantity: item.quantity,
            price: item.price,
          })

          if (!result.success) {
            // Rollback on server error
            if (existingItem) {
              set((state) => ({
                items: state.items.map((i) =>
                  i.productId === item.productId && i.variant === item.variant ? existingItem : i,
                ),
              }))
            } else {
              set((state) => ({
                items: state.items.filter(
                  (i) => !(i.productId === item.productId && i.variant === item.variant),
                ),
              }))
            }
            throw new Error(result.message || 'Failed to add item to cart')
          }

          // Update with server ID if new item
          if (result.cartItemId && !existingItem) {
            set((state) => ({
              items: state.items.map((i) =>
                i.productId === item.productId && i.variant === item.variant
                  ? { ...i, id: result.cartItemId! }
                  : i,
              ),
            }))
          }

          set({ lastSyncedAt: Date.now() })
        } catch (error) {
          console.error('Error adding item to cart:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
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
