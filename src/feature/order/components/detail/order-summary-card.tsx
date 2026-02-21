import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt } from 'lucide-react'
import { Order } from '@/payload-types'
import { formatCurrency } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface OrderSummaryCardProps {
  order: Order
  itemsSubtotal: number
}

export function OrderSummaryCard({ order, itemsSubtotal }: OrderSummaryCardProps) {
  const discount = order.discount || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(itemsSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping Cost</span>
            <span>{formatCurrency(order.shippingCost || 0)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-{formatCurrency(discount)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(order.totalAmount || 0)}
          </span>
        </div>

        {order.paymentMethod && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
          </>
        )}

        {order.notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
