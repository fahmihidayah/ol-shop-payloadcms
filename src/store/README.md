# Store Directory

This directory contains all Zustand state management stores for the application.

## User Store (`user-store.ts`)

The user store manages authentication state with automatic user fetching and localStorage persistence.

### Features

- **Persistent State**: User data persists in localStorage across sessions
- **Auto Fetch**: Automatically fetches user data on mount
- **Instant Updates**: Login/logout updates state immediately
- **Server Sync**: Calls logout API and clears cookies on logout
- **Type Safety**: Full TypeScript support with PayloadCMS Customer type

### Usage

#### Import the store

```typescript
// Import full store
import { useUserStore } from '@/store'

// Import specific selectors (recommended for performance)
import { useUser, useIsAuthenticated, useUserIsLoading } from '@/store'
```

#### Login user

```typescript
const login = useUserStore((state) => state.login)

// After successful authentication
login(userData, authToken)
```

#### Logout user

```typescript
const logout = useUserStore((state) => state.logout)

// Logout (calls API and clears state)
logout()
```

#### Access user data

```typescript
// Using selectors (recommended)
const user = useUser()
const isAuthenticated = useIsAuthenticated()
const isLoading = useUserIsLoading()

// Check if user is logged in
if (isAuthenticated && user) {
  console.log(user.name, user.email)
}
```

#### Fetch user from server

```typescript
const fetchUser = useUserStore((state) => state.fetchUser)

// Fetch current user (useful on app initialization)
useEffect(() => {
  fetchUser()
}, [fetchUser])
```

#### Update user data

```typescript
const updateUser = useUserStore((state) => state.updateUser)

// Update specific user fields
updateUser({ name: 'New Name' })
```

### State Structure

```typescript
interface UserState {
  // Data
  user: Customer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: Customer | null, token?: string) => void
  login: (user: Customer, token: string) => void
  logout: () => void
  updateUser: (user: Partial<Customer>) => void
  fetchUser: () => Promise<void>
}
```

### Integration Example

```typescript
'use client'

import { useEffect } from 'react'
import { useUserStore, useUser, useIsAuthenticated } from '@/store'

export function UserDropdown() {
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const logout = useUserStore((state) => state.logout)
  const fetchUser = useUserStore((state) => state.fetchUser)

  // Fetch user on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div>
      {isAuthenticated && user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <a href="/sign-in">Sign In</a>
      )}
    </div>
  )
}
```

## Cart Store (`cart-store.ts`)

The cart store manages shopping cart state with optimistic updates and server synchronization.

### Features

- **Optimistic Updates**: UI updates immediately, syncs with server in background
- **Persistent State**: Cart persists in localStorage across sessions
- **Server Sync**: Automatically syncs with PayloadCMS backend
- **Rollback on Error**: Automatically reverts changes if server sync fails
- **Type Safety**: Full TypeScript support

### Usage

#### Import the store

```typescript
// Import full store
import { useCartStore } from '@/store'

// Import specific selectors (recommended for performance)
import { useCartItems, useCartTotalItems, useCartTotalPrice } from '@/store'
```

#### Add item to cart

```typescript
const addItem = useCartStore((state) => state.addItem)

await addItem({
  productId: 'product-123',
  productTitle: 'Product Name',
  productImage: '/images/product.jpg',
  productSlug: 'product-slug',
  variant: 'variant-456', // The variant ID from PayloadCMS
  quantity: 2,
  price: 50000,
  stock: 10,
})
```

#### Remove item from cart

```typescript
const removeItem = useCartStore((state) => state.removeItem)

await removeItem('cart-item-id')
```

#### Update quantity

```typescript
const updateQuantity = useCartStore((state) => state.updateQuantity)

updateQuantity('cart-item-id', 3)
```

#### Access cart data

```typescript
// Using selectors (recommended)
const items = useCartItems()
const totalItems = useCartTotalItems()
const totalPrice = useCartTotalPrice()
const isOpen = useCartIsOpen()

// Or access from main store
const { items, totalItems, totalPrice } = useCartStore()
```

#### Cart UI controls

```typescript
const openCart = useCartStore((state) => state.openCart)
const closeCart = useCartStore((state) => state.closeCart)
const toggleCart = useCartStore((state) => state.toggleCart)

// Open cart preview
openCart()
```

#### Clear cart

```typescript
const clearCart = useCartStore((state) => state.clearCart)

clearCart()
```

### State Structure

```typescript
interface CartState {
  // Data
  items: CartItem[]
  totalItems: number
  totalPrice: number

  // UI State
  isOpen: boolean
  isLoading: boolean

  // Metadata
  lastSyncedAt: number | null
}
```

### CartItemUI Type

Extended from PayloadCMS CartItem with UI-specific fields:

```typescript
interface CartItemUI {
  // From PayloadCMS
  id: string
  variant: string // Variant identifier from PayloadCMS
  quantity: number
  price: number
  subtotal: number

  // UI-specific fields
  productId: string
  productTitle: string
  productImage?: string
  productSlug?: string
  stock: number // For stock validation
}
```

## Best Practices

### 1. Use Selectors for Performance

Instead of:
```typescript
const { items, totalItems } = useCartStore()
```

Use:
```typescript
const items = useCartItems()
const totalItems = useCartTotalItems()
```

This prevents unnecessary re-renders when other cart state changes.

### 2. Handle Errors

Always wrap cart operations in try-catch:

```typescript
try {
  await addItem(itemData)
  toast.success('Item added to cart')
} catch (error) {
  toast.error(error instanceof Error ? error.message : 'Failed to add item')
}
```

### 3. Optimistic Updates

The store automatically handles optimistic updates:
1. UI updates immediately
2. Server request happens in background
3. If server fails, changes are rolled back
4. User sees instant feedback

### 4. Persistence

Cart state is automatically persisted to localStorage:
- Persisted fields: `items`, `lastSyncedAt`
- Storage key: `'cart-storage'`
- Automatically restored on page reload

## Example: Complete Add to Cart Flow

```typescript
'use client'

import { useState } from 'react'
import { useCartStore } from '@/store'
import { toast } from 'sonner'

export function ProductView({ product }) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const isLoading = useCartStore((state) => state.isLoading)

  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: product.id,
        productTitle: product.title,
        productImage: product.thumbnail?.url,
        productSlug: product.slug,
        variantId: selectedVariant.id,
        variant: selectedVariant.name,
        quantity,
        price: selectedVariant.price,
        stock: selectedVariant.stock,
      })

      toast.success('Added to cart!')
      setQuantity(1)
      openCart() // Show cart preview
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
```

## Adding New Stores

To add a new store:

1. Create a new file in `/src/store/` (e.g., `wishlist-store.ts`)
2. Follow the cart store pattern
3. Export the store in `/src/store/index.ts`
4. Document usage in this README

Example:

```typescript
// /src/store/wishlist-store.ts
import { create } from 'zustand'

export const useWishlistStore = create((set) => ({
  items: [],
  addToWishlist: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}))

// /src/store/index.ts
export * from './cart-store'
export * from './wishlist-store'
```
