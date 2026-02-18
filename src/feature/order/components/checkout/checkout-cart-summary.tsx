import type { CartItem, Product } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/price-format-utils'
import { getMedia } from '@/lib/type-utils'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'

interface CheckoutCartSummaryProps {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  shipping: number
}

export function CheckoutCartSummary({
  items,
  totalItems,
  totalPrice,
  shipping,
}: CheckoutCartSummaryProps) {
  const total = totalPrice + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items list */}
        <div className="space-y-3">
          {items.map((item) => {
            const product = item.product as Product
            const thumbnail = getMedia(product?.thumbnail)

            return (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden bg-muted">
                  {thumbnail?.url ? (
                    <Image
                      src={thumbnail.url}
                      alt={thumbnail.alt ?? product?.name ?? 'Product'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">No img</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{product?.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium shrink-0">{formatPrice(item.subtotal)}</p>
              </div>
            )
          })}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
