import type { Order } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/price-format-utils'
import { MapPin, User } from 'lucide-react'

const orderStatusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const paymentStatusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Header: order number + status badges */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={orderStatusStyles[order.orderStatus] || ''}
            >
              {order.orderStatus}
            </Badge>
            <Badge
              variant="outline"
              className={paymentStatusStyles[order.paymentStatus] || ''}
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* Shipping info */}
        <div className="mt-4 text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span>{order.shippingAddress.recipientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>
              {order.shippingAddress.city}, {order.shippingAddress.province}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 pt-3 border-t flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
