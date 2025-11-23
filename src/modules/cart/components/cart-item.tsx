'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuantityCounter } from '@/components/ui/quantity-counter'
import type { CartItem as CartItemType } from '@/store/cart-store'
import { Product } from '@/payload-types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string, itemTitle: string) => void
  isLoading?: boolean
}

export function CartItem({ item, onUpdateQuantity, onRemove, isLoading = false }: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > item.stock) return
    onUpdateQuantity(item.id, newQuantity)
  }

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 rounded-md border bg-muted overflow-hidden">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productTitle}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.productSlug || item.productId}`}
            className="font-medium hover:underline line-clamp-2"
          >
            {item.productTitle}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Variant: {item.variant}</p>
          <QuantityCounter
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.stock}
            disabled={isLoading}
          />
        </div>

        {/* Mobile: Price and Actions */}
        <div className="flex items-center justify-between mt-2 sm:hidden">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg">{formatPrice(item.price)}</span>
            <span className="text-xs text-muted-foreground">
              Subtotal: {formatPrice(item.subtotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: Price */}
      <div className="hidden sm:flex flex-col items-end justify-between min-w-[120px]">
        <div className="text-right">
          <p className="font-semibold">{formatPrice(item.price)}</p>
          <p className="text-sm text-muted-foreground">per item</p>
        </div>
      </div>

      {/* Subtotal */}
      <div className="hidden sm:flex flex-col items-end justify-between min-w-[120px]">
        <p className="font-bold text-lg">{formatPrice(item.subtotal)}</p>
        {item.stock <= 5 && <p className="text-xs text-orange-600">Only {item.stock} left</p>}
      </div>

      {/* Remove Button */}
      <div className="hidden sm:flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.id, item.productTitle)}
          disabled={isLoading}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile: Quantity and Remove */}
      <div className="sm:hidden w-full flex items-center justify-between mt-2">
        <QuantityCounter
          value={item.quantity}
          onChange={handleQuantityChange}
          min={1}
          max={item.stock}
          disabled={isLoading}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id, item.productTitle)}
          disabled={isLoading}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  )
}
