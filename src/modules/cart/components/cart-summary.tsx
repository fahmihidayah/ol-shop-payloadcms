'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface CartSummaryProps {
  totalItems: number
  totalPrice: number
  isLoading?: boolean
}

export function CartSummary({ totalItems, totalPrice, isLoading = false }: CartSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Calculate estimated tax (11% PPN for Indonesia)
  const tax = totalPrice > 0 ? totalPrice * 0.11 : 0
  const estimatedTotal = totalPrice + tax

  // Don't render if cart is empty
  if (totalItems === 0 && !isLoading) {
    return null
  }

  return (
    <div className="bg-muted/30 rounded-lg border p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3">
        {/* Items Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-sm text-muted-foreground">Calculated at checkout</span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax (Est.)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Estimated Total</span>
            <span className="text-xl font-bold text-primary">{formatPrice(estimatedTotal)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Button asChild className="w-full mt-6" size="lg" disabled={isLoading || totalItems === 0}>
        <Link href="/checkout">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Proceed to Checkout
        </Link>
      </Button>

      {/* Continue Shopping */}
      <Button asChild variant="outline" className="w-full mt-3" disabled={isLoading}>
        <Link href="/">Continue Shopping</Link>
      </Button>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t space-y-2 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <span>•</span>
          <span>Secure checkout with SSL encryption</span>
        </p>
        <p className="flex items-start gap-2">
          <span>•</span>
          <span>Free shipping on orders over Rp 500,000</span>
        </p>
        <p className="flex items-start gap-2">
          <span>•</span>
          <span>Easy returns within 30 days</span>
        </p>
      </div>
    </div>
  )
}
