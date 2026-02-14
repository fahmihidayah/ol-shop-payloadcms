'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'

interface OrderStats {
  total: number
  pending: number
  completed: number
  cancelled: number
}

interface OrderStatisticsProps {
  stats: OrderStats
}

const statItems = [
  {
    label: 'Total Orders',
    key: 'total' as keyof OrderStats,
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Pending',
    key: 'pending' as keyof OrderStats,
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    label: 'Completed',
    key: 'completed' as keyof OrderStats,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    label: 'Cancelled',
    key: 'cancelled' as keyof OrderStats,
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
]

export function OrderStatistics({ stats }: OrderStatisticsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon
        const value = stats[item.key]

        return (
          <Card key={item.key}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
