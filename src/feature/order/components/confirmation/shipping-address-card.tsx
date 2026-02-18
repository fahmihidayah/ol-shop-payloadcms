import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Order } from '@/payload-types'

interface ShippingAddressCardProps {
  shippingAddress: Order['shippingAddress']
}

export function ShippingAddressCard({ shippingAddress }: ShippingAddressCardProps) {
  if (!shippingAddress) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p className="font-semibold">{shippingAddress.recipientName}</p>
          <p className="text-muted-foreground">{shippingAddress.phone}</p>
          <p className="text-muted-foreground">{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && (
            <p className="text-muted-foreground">{shippingAddress.addressLine2}</p>
          )}
          <p className="text-muted-foreground">
            {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
          </p>
          <p className="text-muted-foreground">{shippingAddress.country}</p>
        </div>
      </CardContent>
    </Card>
  )
}
