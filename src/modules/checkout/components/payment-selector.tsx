'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export interface PaymentOption {
  id: string
  name: string
  type: string
  description?: string | null
  processingFee?: number | null
  isActive: boolean
}

interface PaymentSelectorProps {
  paymentOptions: PaymentOption[]
  selectedPaymentId?: string
  onSelectPayment: (paymentId: string) => void
}

export function PaymentSelector({
  paymentOptions,
  selectedPaymentId,
  onSelectPayment,
}: PaymentSelectorProps) {
  const activeOptions = paymentOptions.filter((option) => option.isActive)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Method</h3>

      {activeOptions.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No payment options available</p>
        </div>
      ) : (
        <RadioGroup value={selectedPaymentId} onValueChange={onSelectPayment}>
          <div className="space-y-3">
            {activeOptions.map((option) => (
              <div key={option.id} className="relative">
                <div className="flex items-start space-x-3 border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <div className="font-semibold text-sm mb-1">{option.name}</div>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    )}
                    {option.processingFee && option.processingFee > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Processing fee: {option.processingFee}%
                      </p>
                    )}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  )
}
