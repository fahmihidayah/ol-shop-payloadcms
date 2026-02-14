'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatPrice } from "@/lib/price-format-utils"
import { getMedia } from "@/lib/type-utils"
import { Product } from "@/payload-types"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { addToCart } from "../actions/add-to-cart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProductItem({ product }: { product: Product }) {
  const thumbnail = getMedia(product.thumbnail)
  const thumbnailUrl = thumbnail?.url
  const thumbnailAlt = thumbnail?.alt ?? product.name
  const [isPending, startTransition] = useTransition()
  const [isWishlistActive, setIsWishlistActive] = useState(false)
  const router = useRouter()

  // Get the first active variant or first variant
  const defaultVariant = product['product-variant']?.find(v => v.isActive) ?? product['product-variant']?.[0]

  const handleAddToCart = async () => {
    if (!defaultVariant) {
      toast.error('No variant available for this product')
      return
    }

    startTransition(async () => {
      const result = await addToCart({
        productId: product.id,
        variantId: defaultVariant.id!,
        quantity: 1,
      })

      if (result.success) {
        toast.success('Product added to cart successfully!')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to add product to cart')
      }
    })
  }

  const handleToggleWishlist = () => {
    // TODO: Implement wishlist functionality
    setIsWishlistActive(!isWishlistActive)
    toast.info(isWishlistActive ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Wishlist Button - Positioned absolutely over the image */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
        aria-label="Add to wishlist"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlistActive ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
      </button>

      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block">
          {thumbnailUrl ? (
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={thumbnailUrl}
                alt={thumbnailAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="aspect-square w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </Link>
      </CardHeader>

      <CardContent className="pt-4 pb-3">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {defaultVariant && (
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-lg font-bold text-primary">
              {formatPrice(defaultVariant.price)}
            </p>
            {defaultVariant.oldPrice && defaultVariant.oldPrice > defaultVariant.price && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(defaultVariant.oldPrice)}
              </p>
            )}
          </div>
        )}

        {defaultVariant && defaultVariant.stockQuantity !== undefined && (
          <p className={`text-xs mt-1 ${defaultVariant.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {defaultVariant.stockQuantity > 0
              ? `${defaultVariant.stockQuantity} in stock`
              : 'Out of stock'}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4 gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={isPending || !defaultVariant || defaultVariant.stockQuantity === 0}
          className="flex-1 gap-2"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Link href={`/products/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}