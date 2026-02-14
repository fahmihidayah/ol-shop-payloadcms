import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/price-format-utils'
import Image from 'next/image'
import type { OrderItem, Product } from '@/payload-types'
import { getMedia } from '@/lib/type-utils'

interface OrderItemsCardProps {
  orderItems: OrderItem[]
}

export function OrderItemsCard({ orderItems }: OrderItemsCardProps) {
  if (!orderItems || orderItems.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderItems.map((item) => {
            const product = typeof item.product === 'object' ? item.product : null
            const thumbnail = product ? getMedia(product.thumbnail) : null
            const imageUrl = item.productSnapshot?.imageUrl || thumbnail?.url
            const productName = item.productSnapshot?.title || product?.name || 'Product'
            const variantName = item.productSnapshot?.variantTitle || ''

            return (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{productName}</h4>
                  {variantName && (
                    <p className="text-xs text-muted-foreground mt-0.5">{variantName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{formatPrice(item.price)} × {item.quantity}</span>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
