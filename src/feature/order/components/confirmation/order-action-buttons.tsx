import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface OrderActionButtonsProps {
  status: 'success' | 'pending' | 'canceled' | 'unknown'
  orderId?: string
}

export function OrderActionButtons({ status, orderId }: OrderActionButtonsProps) {
  if (status === 'success') {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1">
          <Link href={`/order/${orderId}`}>View Order Details</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1">
          <Link href={`/order/${orderId}`}>Check Order Status</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  if (status === 'canceled') {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1">
          <Link href="/cart">Back to Cart</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return null
}
