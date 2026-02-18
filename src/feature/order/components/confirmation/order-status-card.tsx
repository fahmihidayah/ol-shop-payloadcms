import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { OrderStatusInfo } from '@/feature/order/types/order'

interface OrderStatusCardProps {
  statusInfo: OrderStatusInfo
}

export function OrderStatusCard({ statusInfo }: OrderStatusCardProps) {
  const StatusIcon = statusInfo.icon

  return (
    <Card className={`border-2 ${statusInfo.borderColor}`}>
      <CardHeader className={statusInfo.bgColor}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white">
            <StatusIcon className={`h-8 w-8 ${statusInfo.iconColor}`} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-1">{statusInfo.title}</CardTitle>
            <CardDescription className="text-base">{statusInfo.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
