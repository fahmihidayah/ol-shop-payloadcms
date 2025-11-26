'use client'

import { ImageMedia } from '@/modules/media/image-media'
import { Media, Product } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { QuantityCounter } from '@/components/ui/quantity-counter'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/store'

export default function ProductDetailView({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const addProduct = useCartStore((state: any) => state.addProduct)
  const openCart = useCartStore((state: any) => state.openCart)
  const isLoading = useCartStore((state: any) => state.isLoading)

  // Get all variants
  const variants = product['product-variant'] || []
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '')

  // Get selected variant details
  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId)
  const price = selectedVariant?.price || 0
  const compareAtPrice = selectedVariant?.oldPrice || 0
  const stock = selectedVariant?.stockQuantity || 0

  const handleAddToCart = async () => {
    if (!selectedVariantId || !selectedVariant) {
      toast.error('Please select a variant')
      return
    }

    if (stock === 0) {
      toast.error('This variant is out of stock')
      return
    }

    try {
      await addProduct(product, selectedVariantId, quantity)

      toast.success('Item added to cart')
      setQuantity(1) // Reset quantity after successful add
      openCart() // Open cart preview
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart')
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

        {/* Variant Selection */}
        {variants.length > 0 && (
          <div className="flex flex-col gap-2">
            <label htmlFor="variant-select" className="text-sm sm:text-base font-medium">
              Select Variant:
            </label>
            <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
              <SelectTrigger id="variant-select" className="w-full sm:w-auto">
                <SelectValue placeholder="Choose a variant" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant: any) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.variant} - {formatPrice(variant.price)}
                    {variant.stock === 0 && ' (Out of Stock)'}
                    {variant.stock > 0 && variant.stock <= 5 && ` (Only ${variant.stock} left)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
            className="gap-2 text-base w-full sm:w-auto"
            onClick={handleAddToCart}
            disabled={stock === 0 || isLoading}
          >
            <ShoppingCart className="h-5 w-5" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>

        {/* Additional Info */}
        {selectedVariant && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Product Details</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {selectedVariant.variant && (
                <li>
                  <span className="font-medium">Variant:</span> {selectedVariant.variant}
                </li>
              )}
              {selectedVariant.sku && (
                <li>
                  <span className="font-medium">SKU:</span> {selectedVariant.sku}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
