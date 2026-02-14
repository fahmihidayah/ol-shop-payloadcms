'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem, Product } from '@/payload-types'
import { getMedia } from '@/lib/type-utils'
import { formatPrice } from '@/lib/price-format-utils'
import { deleteCartItem, updateCartItemQuantity } from '../actions'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface CartItemRowProps {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const product = item.product as Product
  const thumbnail = getMedia(product?.thumbnail)
  const thumbnailUrl = thumbnail?.url
  const thumbnailAlt = thumbnail?.alt ?? product?.name ?? 'Product'

  // Find the variant name from the product
  const variant = product?.['product-variant']?.find((v) => v.id === item.variant)
  const variantName = variant?.variant || 'Default'
  const maxStock = variant?.stockQuantity ?? 999

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`)
      return
    }

    setQuantity(newQuantity)

    // Update quantity with debounce
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, newQuantity)

      if (result.success) {
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update quantity')
        // Revert quantity on error
        setQuantity(item.quantity)
      }
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteCartItem(item.id)

    if (result.success) {
      toast.success('Item removed from cart')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to remove item')
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative flex gap-3 sm:gap-4 py-4 border-b last:border-b-0">
      {/* Delete Button - Top Right */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            className="absolute top-3 right-5 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{product?.name}&quot; from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <Link href={`/products/${product?.slug}`}>
            <Image
              src={thumbnailUrl}
              alt={thumbnailAlt}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 pr-8">
        {/* Product Name */}
        <Link
          href={`/products/${product?.slug}`}
          className="font-medium text-sm sm:text-base hover:text-primary transition-colors line-clamp-2 block"
        >
          {product?.name}
        </Link>

        {/* Variant */}
        {variantName !== 'Default' && (
          <p className="text-xs text-muted-foreground mt-0.5">{variantName}</p>
        )}

        {/* Price per item */}
        <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(item.price)} each</p>

        {/* Quantity Controls and Subtotal */}
        <div className="flex items-center gap-3 mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isPending || isDeleting}
              className="h-7 w-7"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max={maxStock}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={isPending || isDeleting}
              className="h-7 w-12 border-0 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxStock || isPending || isDeleting}
              className="h-7 w-7"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Subtotal */}
          <p className="font-semibold text-sm sm:text-base ml-auto">{formatPrice(item.subtotal)}</p>
        </div>
      </div>
    </div>
  )
}
