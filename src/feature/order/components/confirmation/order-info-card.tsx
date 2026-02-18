import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Clock } from 'lucide-react'

interface OrderInfoCardProps {
  status: 'success' | 'pending' | 'canceled' | 'unknown'
}

export function OrderInfoCard({ status }: OrderInfoCardProps) {
  if (status === 'success') {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-blue-900">What&apos;s Next?</p>
              <p className="text-blue-800">
                We&apos;ve sent a confirmation email to your registered email address. Your order will
                be processed and shipped within 1-3 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'pending') {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-yellow-900">Payment Processing</p>
              <p className="text-yellow-800">
                Your payment is being verified. This usually takes a few minutes. You can check
                your order status anytime using the order number above.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
