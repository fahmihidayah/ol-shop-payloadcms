import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import { OrderItem } from '@/payload-types'
import { OrderItemRow } from './order-item-row'
import { Separator } from '@/components/ui/separator'

interface OrderItemsCardProps {
  items: OrderItem[]
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5" />
          Order Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {items.map((item, index) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
