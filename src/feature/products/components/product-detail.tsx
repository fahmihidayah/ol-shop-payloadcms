'use client'

import { useState } from 'react'
import { Product } from '@/payload-types'
import { ProductImageGallery } from './product-image-gallery'
import { ProductDetailsInfo } from './product-details-info'
import { ProductVariantSelector } from './product-variant-selector'
import { ProductAddToCart } from './product-add-to-cart'
import { RelatedProducts } from './related-products'
import { Separator } from '@/components/ui/separator'

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  // Get first active variant as default
  const defaultVariant =
    product['product-variant']?.find((v) => v.isActive) ||
    product['product-variant']?.[0]

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id || '',
  )

  if (!defaultVariant) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Available</h1>
          <p className="text-muted-foreground">
            This product has no available variants.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Left Column - Images */}
        <div>
          <ProductImageGallery product={product} />
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <ProductDetailsInfo
            product={product}
            selectedVariantId={selectedVariantId}
          />

          <Separator />

          {/* Variant Selector */}
          <ProductVariantSelector
            product={product}
            selectedVariantId={selectedVariantId}
            onVariantChange={setSelectedVariantId}
          />

          {/* Add to Cart */}
          <ProductAddToCart
            product={product}
            selectedVariantId={selectedVariantId}
          />
        </div>
      </div>

      {/* Related Products Section */}
      <Separator className="my-12" />
      <RelatedProducts products={relatedProducts} />
    </div>
  )
}
