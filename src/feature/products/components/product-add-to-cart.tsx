'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Product } from '@/payload-types'
import { addToCart } from '../actions/add-to-cart'
import { toast } from 'sonner'

interface ProductAddToCartProps {
  product: Product
  selectedVariantId: string
}

export function ProductAddToCart({ product, selectedVariantId }: ProductAddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [isWishlistActive, setIsWishlistActive] = useState(false)
  const router = useRouter()

  // Find selected variant
  const selectedVariant = product['product-variant']?.find(
    (v) => v.id === selectedVariantId,
  )

  if (!selectedVariant) {
    return null
  }

  const maxStock = selectedVariant.stockQuantity ?? 999
  const isOutOfStock = maxStock === 0

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > maxStock) return
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock')
      return
    }

    startTransition(async () => {
      const result = await addToCart({
        productId: product.id,
        variantId: selectedVariantId,
        quantity,
      })

      if (result.success) {
        toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to add to cart')
      }
    })
  }

  const handleToggleWishlist = () => {
    // TODO: Implement wishlist functionality
    setIsWishlistActive(!isWishlistActive)
    toast.info(isWishlistActive ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isPending}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxStock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={isPending}
              className="h-10 w-20 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxStock || isPending}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {maxStock} available
          </span>
        </div>
      </div>

      {/* Stock Status */}
      {isOutOfStock && (
        <p className="text-sm font-medium text-red-600">Out of Stock</p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isPending || isOutOfStock}
          className="flex-1 h-12 text-base"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isPending ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleWishlist}
          className="h-12 w-12"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlistActive ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </Button>
      </div>
    </div>
  )
}
