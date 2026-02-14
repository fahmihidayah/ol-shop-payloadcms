'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/price-format-utils'
import { Product, Category } from '@/payload-types'
import { serialize } from '@/lib/serialize'

interface ProductDetailsInfoProps {
  product: Product
  selectedVariantId: string
}

export function ProductDetailsInfo({ product, selectedVariantId }: ProductDetailsInfoProps) {
  // Find selected variant
  const selectedVariant = product['product-variant']?.find(
    (v) => v.id === selectedVariantId,
  )

  const category =
    typeof product.category === 'string' ? null : (product.category as Category)

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      {category && (
        <div>
          <Badge variant="secondary">{category.name}</Badge>
        </div>
      )}

      {/* Product Name */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {product.name}
        </h1>
      </div>

      {/* Price */}
      {selectedVariant && (
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-bold text-primary">
            {formatPrice(selectedVariant.price)}
          </p>
          {selectedVariant.oldPrice && selectedVariant.oldPrice > selectedVariant.price && (
            <p className="text-xl text-muted-foreground line-through">
              {formatPrice(selectedVariant.oldPrice)}
            </p>
          )}
          {selectedVariant.oldPrice && selectedVariant.oldPrice > selectedVariant.price && (
            <Badge variant="destructive">
              Save{' '}
              {Math.round(
                ((selectedVariant.oldPrice - selectedVariant.price) /
                  selectedVariant.oldPrice) *
                  100,
              )}
              %
            </Badge>
          )}
        </div>
      )}

      <Separator />

      {/* Description */}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <div
          dangerouslySetInnerHTML={{
            __html: serialize(product.description),
          }}
        />
      </div>

      {/* Additional Product Info */}
      {selectedVariant && (
        <>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Availability:</span>
              <span
                className={
                  selectedVariant.stockQuantity && selectedVariant.stockQuantity > 0
                    ? 'text-green-600 font-medium'
                    : 'text-red-600 font-medium'
                }
              >
                {selectedVariant.stockQuantity && selectedVariant.stockQuantity > 0
                  ? 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>
            {selectedVariant.sku && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{selectedVariant.sku}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
