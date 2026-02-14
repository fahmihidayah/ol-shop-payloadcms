import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getCart } from '../actions'
import { CartItemsList } from './cart-items-list'
import { CartSummary } from './cart-summary'

export async function CartPage() {
  const cart = await getCart()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground mt-1">Review your items and proceed to checkout</p>
      </div>

      {/* Main Content */}
      {!cart || cart.items.length === 0 ? (
        <CartItemsList items={[]} />
      ) : (
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Cart Items - Takes 2 columns */}
          <div className="w-full">
            <CartItemsList items={cart.items} />
          </div>

          {/* Cart Summary - Takes 1 column */}
          <div className="w-full md:w-1/3">
            <CartSummary
              totalItems={cart.totalItems}
              totalPrice={cart.totalPrice}
              shipping={0} // Free shipping for now
              tax={0} // No tax calculation for now
            />
          </div>
        </div>
      )}
    </div>
  )
}
