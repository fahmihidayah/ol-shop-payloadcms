'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/price-format-utils'
import { getMedia } from '@/lib/type-utils'
import { CartItem, Product } from '@/payload-types'
import { ShoppingCart, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CartWithItems } from '@/feature/cart/actions'

interface NavbarCartProps {
  cart: CartWithItems | null
}

export function NavbarCart({ cart }: NavbarCartProps) {
  const totalItems = cart?.totalItems ?? 0
  const items = cart?.items ?? []
  const totalPrice = cart?.totalPrice ?? 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </h3>
        </div>

        <Separator />

        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Your cart is empty</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-[400px] overflow-y-auto">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <Separator />

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

function CartItemRow({ item }: { item: CartItem }) {
  const product = item.product as Product
  const thumbnail = getMedia(product?.thumbnail)
  const thumbnailUrl = thumbnail?.url
  const thumbnailAlt = thumbnail?.alt ?? product?.name ?? 'Product'

  // Find the variant name from the product
  const variant = product?.['product-variant']?.find((v) => v.id === item.variant)
  const variantName = variant?.variant || 'Default'

  return (
    <div className="p-3 hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={thumbnailAlt}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${product?.slug}`}
            className="font-medium text-sm line-clamp-1 hover:underline"
          >
            {product?.name}
          </Link>
          {variantName !== 'Default' && (
            <p className="text-xs text-muted-foreground">{variantName}</p>
          )}
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
            <span className="text-sm font-semibold">{formatPrice(item.subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
