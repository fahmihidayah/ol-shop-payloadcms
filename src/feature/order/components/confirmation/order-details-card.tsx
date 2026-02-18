import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/price-format-utils'
import type { Order } from '@/payload-types'

interface OrderDetailsCardProps {
  order: Order
  reference: string
}

export function OrderDetailsCard({ order, reference }: OrderDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Number */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-sm text-muted-foreground">Order Number</span>
          <span className="font-mono font-semibold">{order.orderNumber}</span>
        </div>

        {/* Payment Reference */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-sm text-muted-foreground">Payment Reference</span>
          <span className="font-mono text-sm">{reference}</span>
        </div>

        {/* Payment Method */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-sm text-muted-foreground">Payment Method</span>
          <span className="font-medium">{order.paymentMethod}</span>
        </div>

        {/* Order Status */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-sm text-muted-foreground">Order Status</span>
          <span className="font-medium capitalize">{order.orderStatus}</span>
        </div>

        {/* Payment Status */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-sm text-muted-foreground">Payment Status</span>
          <span className="font-medium capitalize">{order.paymentStatus}</span>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-semibold">Total Amount</span>
          <span className="text-xl font-bold">{formatPrice(order.totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
