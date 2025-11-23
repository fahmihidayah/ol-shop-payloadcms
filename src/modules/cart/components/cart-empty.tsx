'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-6 mb-6">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg">
          <Link href="/">Start Shopping</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>

      {/* Optional: Popular Categories or Featured Products */}
      <div className="mt-12 w-full max-w-2xl">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">
          POPULAR CATEGORIES
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/category/electronics"
            className="p-4 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors text-center"
          >
            <p className="text-sm font-medium">Electronics</p>
          </Link>
          <Link
            href="/category/fashion"
            className="p-4 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors text-center"
          >
            <p className="text-sm font-medium">Fashion</p>
          </Link>
          <Link
            href="/category/home"
            className="p-4 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors text-center"
          >
            <p className="text-sm font-medium">Home & Living</p>
          </Link>
          <Link
            href="/category/sports"
            className="p-4 border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors text-center"
          >
            <p className="text-sm font-medium">Sports</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
