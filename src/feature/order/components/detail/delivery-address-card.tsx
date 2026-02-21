import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { Order } from '@/payload-types'

interface DeliveryAddressCardProps {
  shippingAddress: Order['shippingAddress']
}

export function DeliveryAddressCard({ shippingAddress }: DeliveryAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="font-medium">{shippingAddress.recipientName}</p>
          <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
        </div>
        <div className="text-sm">
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>
            {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country || 'Indonesia'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
