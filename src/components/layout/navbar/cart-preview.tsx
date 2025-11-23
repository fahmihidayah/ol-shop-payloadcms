'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ShoppingCart, X, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore, useCartItems, useCartTotalItems, useCartTotalPrice, useCartIsOpen } from '@/store'

export function CartPreview() {
  const items = useCartItems()
  const totalItems = useCartTotalItems()
  const totalPrice = useCartTotalPrice()
  const isOpen = useCartIsOpen()
  const isLoading = useCartStore((state: any) => state.isLoading)
  const closeCart = useCartStore((state: any) => state.closeCart)
  const toggleCart = useCartStore((state: any) => state.toggleCart)
  const removeItem = useCartStore((state: any) => state.removeItem)

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove item')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Popover open={isOpen} onOpenChange={toggleCart}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Shopping cart">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 sm:w-96 p-0">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Shopping Cart</h3>
            <span className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Cart Items */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground text-center">Your cart is empty</p>
                <Button asChild variant="link" className="mt-2" onClick={() => closeCart()}>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 p-4 hover:bg-muted/50 transition-colors">
                    {/* Product Image */}
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md border bg-muted overflow-hidden">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.productTitle}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                        <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex-shrink-0 h-6 w-6 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <>
              <div className="border-t px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full" onClick={() => closeCart()}>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={() => closeCart()}>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
