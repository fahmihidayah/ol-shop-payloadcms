'use client'

import Image from 'next/image'
import type { CartItem as CartItemType } from '@/store/cart-store'

interface CheckoutItemProps {
  item: CartItemType
}

export function CheckoutItem({ item }: CheckoutItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex gap-4 py-4">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md border bg-muted overflow-hidden">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium line-clamp-2">{item.productTitle}</h3>
        <p className="text-sm text-muted-foreground mt-1">Variant: {item.variant}</p>
        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold">{formatPrice(item.subtotal)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatPrice(item.price)} x {item.quantity}
        </p>
      </div>
    </div>
  )
}
