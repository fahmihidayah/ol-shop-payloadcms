'use client'

import { ImageMedia } from '@/modules/media/image-media'
import { Media, Product } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { QuantityCounter } from '@/components/ui/quantity-counter'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export default function ProductDetailView({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Get the first variant or use default values
  const variants = (product as any)['product-variant'] || []
  const firstVariant = variants[0]
  const price = firstVariant?.price || 0
  const compareAtPrice = firstVariant?.compareAtPrice
  const stock = firstVariant?.stock || 0

  const handleAddToCart = async () => {
    setIsLoading(true)
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { product: product.id, quantity })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Product Image */}
      <div className="w-full lg:w-1/3 border border-slate-300 rounded-lg">
        <ImageMedia
          media={product.thumbnail as Media}
          className="w-full h-auto rounded-lg"
          width={600}
          height={600}
        />
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4 sm:gap-5">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{product.title}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-primary">{formatPrice(price)}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-base sm:text-lg text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {stock > 0 ? (
          <p className="text-sm sm:text-base text-green-600 font-medium">
            In Stock ({stock} available)
          </p>
        ) : (
          <p className="text-sm sm:text-base text-red-600 font-medium">Out of Stock</p>
        )}

        {/* Divider */}
        <div className="border-t border-border my-2" />

        {/* Description */}
        <div className="prose prose-sm sm:prose-base max-w-none">
          <RichText data={product.description} />
        </div>

        {/* Divider */}
        <div className="border-t border-border my-2" />

        {/* Quantity and Add to Cart */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-sm sm:text-base font-medium">Quantity:</span>
            <QuantityCounter
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={stock > 0 ? Math.min(stock, 99) : 1}
              disabled={stock === 0}
            />
          </div>

          <Button
            size="lg"
            className=" gap-2 text-base w-min"
            onClick={handleAddToCart}
            disabled={stock === 0 || isLoading}
          >
            <ShoppingCart className="h-5 w-5" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>

        {/* Additional Info */}
        {firstVariant && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Product Details</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {firstVariant.variant && (
                <li>
                  <span className="font-medium">Variant:</span> {firstVariant.variant}
                </li>
              )}
              {firstVariant.sku && (
                <li>
                  <span className="font-medium">SKU:</span> {firstVariant.sku}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
