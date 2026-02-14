'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CreditCard } from 'lucide-react'
import Image from 'next/image'
import type { DuitkuPaymentMethod } from '@/types/duitku'
import { formatPrice } from '@/lib/price-format-utils'

interface CheckoutPaymentOptionsProps {
  paymentOptions: DuitkuPaymentMethod[]
  selectedPaymentId: string
  onSelect: (paymentId: string) => void
}

export function CheckoutPaymentOptions({
  paymentOptions,
  selectedPaymentId,
  onSelect,
}: CheckoutPaymentOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No payment methods available.
          </p>
        ) : (
          <RadioGroup value={selectedPaymentId} onValueChange={onSelect} className="grid grid-4">
            <div className="space-y-3">
              {paymentOptions.map((option) => {
                const fee = parseFloat(option.totalFee) || 0

                return (
                  <Label
                    key={option.paymentMethod}
                    htmlFor={`payment-${option.paymentMethod}`}
                    className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50 has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5"
                  >
                    <RadioGroupItem
                      value={option.paymentMethod}
                      id={`payment-${option.paymentMethod}`}
                      className="mt-1"
                    />
                    {/* Icon */}
                    {option.paymentImage ? (
                      <div className="relative w-12 h-10 shrink-0 rounded-md overflow-hidden bg-white border">
                        <Image
                          src={option.paymentImage}
                          alt={option.paymentName}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-10 shrink-0 rounded-md bg-muted flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    {/* Info */}
                    <div className="flex-1 space-y-0.5 font-normal">
                      <span className="font-semibold text-sm block">{option.paymentName}</span>
                      {fee > 0 && (
                        <span className="text-xs text-muted-foreground block">
                          Fee: {formatPrice(fee)}
                        </span>
                      )}
                    </div>
                  </Label>
                )
              })}
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  )
}
