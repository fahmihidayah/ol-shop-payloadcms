'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CheckoutSummaryProps {
  subtotal: number
  tax: number
  shippingCost: number
  processingFee: number
  total: number
  onPlaceOrder: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function CheckoutSummary({
  subtotal,
  tax,
  shippingCost,
  processingFee,
  total,
  onPlaceOrder,
  isLoading = false,
  disabled = false,
}: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-muted/30 rounded-lg border p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{formatPrice(shippingCost)}</span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax (11%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Processing Fee */}
        {processingFee > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing Fee</span>
            <span className="font-medium">{formatPrice(processingFee)}</span>
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={onPlaceOrder}
        className="w-full mt-6"
        size="lg"
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Place Order'
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        By placing your order, you agree to our{' '}
        <a href="/terms" className="underline hover:text-primary">
          Terms & Conditions
        </a>
      </p>
    </div>
  )
}
