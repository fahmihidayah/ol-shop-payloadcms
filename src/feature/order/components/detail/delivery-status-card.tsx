import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Package, CheckCircle2, XCircle } from 'lucide-react'
import { Order } from '@/payload-types'
import { OrderStatusBadge, PaymentStatusBadge } from './order-status-badge'

interface DeliveryStatusCardProps {
  order: Order
}

export function DeliveryStatusCard({ order }: DeliveryStatusCardProps) {
  const getStatusIcon = () => {
    switch (order.orderStatus) {
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-yellow-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Delivery Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Status</span>
            <OrderStatusBadge status={order.orderStatus || 'pending'} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment Status</span>
            <PaymentStatusBadge status={order.paymentStatus || 'pending'} />
          </div>
        </div>

        {order.shippingService?.shippingService && (
          <div className="space-y-1 border-t pt-4">
            <p className="text-sm font-medium">Shipping Service</p>
            <p className="text-sm text-muted-foreground">{order.shippingService.shippingService}</p>
          </div>
        )}

        {order.shippingService?.resiNumber && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Tracking Number</p>
            <p className="font-mono text-sm text-muted-foreground">
              {order.shippingService.resiNumber}
            </p>
          </div>
        )}

        {order.paymentReference && (
          <div className="space-y-1 border-t pt-4">
            <p className="text-sm font-medium">Payment Reference</p>
            <p className="font-mono text-sm text-muted-foreground">{order.paymentReference}</p>
          </div>
        )}

        {order.vaNumber && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Virtual Account Number</p>
            <p className="font-mono text-sm text-muted-foreground">{order.vaNumber}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
