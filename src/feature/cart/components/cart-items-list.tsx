'use client'

import { CartItem } from '@/payload-types'
import { CartItemRow } from './cart-item-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

interface CartItemsListProps {
  items: CartItem[]
}

export function CartItemsList({ items }: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to your cart to see them here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart ({items.length})</CardTitle>
      </CardHeader>
      <hr />
      <CardContent className="p-0">
        <div className="divide-y px-6">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
