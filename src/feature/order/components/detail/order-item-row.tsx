import Image from 'next/image'
import { OrderItem, Product } from '@/payload-types'
import { formatCurrency } from '@/lib/utils'

interface OrderItemRowProps {
  item: OrderItem
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const product = typeof item.product === 'object' ? item.product : null
  const productName = item.productSnapshot?.title || product?.name || 'Unknown Product'
  const variantName = item.productSnapshot?.variantTitle || item.variant

  // Get image URL from snapshot or product thumbnail
  let imageUrl: string | null = item.productSnapshot?.imageUrl || null
  if (!imageUrl && product?.thumbnail && typeof product.thumbnail === 'object') {
    imageUrl = product.thumbnail.url || null
  }

  return (
    <div className="flex gap-4 py-4">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={productName}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium text-sm md:text-base">{productName}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">{variantName}</p>
          {item.productSnapshot?.sku && (
            <p className="text-xs text-muted-foreground">SKU: {item.productSnapshot.sku}</p>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-xs md:text-sm text-muted-foreground">
            Qty: {item.quantity} × {formatCurrency(item.price)}
          </span>
          <span className="font-medium text-sm md:text-base">{formatCurrency(item.subtotal)}</span>
        </div>
      </div>
    </div>
  )
}
