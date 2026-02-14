'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/price-format-utils'
import { ShoppingBag } from 'lucide-react'

interface CartSummaryProps {
  totalItems: number
  totalPrice: number
  shipping?: number
  tax?: number
}

export function CartSummary({
  totalItems,
  totalPrice,
  shipping = 0,
  tax = 0,
}: CartSummaryProps) {
  const subtotal = totalPrice
  const total = subtotal + shipping + tax

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Proceed to Checkout
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
