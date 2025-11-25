'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCartItems, useCartTotalPrice } from '@/store'
import { CheckoutItem } from '../components/checkout-item'
import { AddressSelector } from '../components/address-selector'
import { PaymentSelector, type PaymentOption } from '../components/payment-selector'
import { CheckoutSummary } from '../components/checkout-summary'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import type { Address } from '@/payload-types'

interface CheckoutPageProps {
  addresses: Address[]
  paymentOptions: PaymentOption[]
  onPlaceOrder: (data: {
    addressId: string
    paymentOptionId: string
    items: any[]
    totals: {
      subtotal: number
      tax: number
      shippingCost: number
      processingFee: number
      total: number
    }
  }) => Promise<{ success: boolean; message?: string; orderId?: string }>
}

export function CheckoutPage({ addresses, paymentOptions, onPlaceOrder }: CheckoutPageProps) {
  const router = useRouter()
  const cartItems = useCartItems()
  const subtotal = useCartTotalPrice()

  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '')
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    paymentOptions.find((p) => p.isActive)?.id || '',
  )
  const [isLoading, setIsLoading] = useState(false)

  // Calculate totals
  const totals = useMemo(() => {
    const tax = subtotal * 0.11 // 11% PPN
    const shippingCost = subtotal >= 500000 ? 0 : 20000 // Free shipping over 500k

    const selectedPayment = paymentOptions.find((p) => p.id === selectedPaymentId)
    const processingFeePercent = selectedPayment?.processingFee || 0
    const processingFee = (subtotal + shippingCost + tax) * (processingFeePercent / 100)

    const total = subtotal + tax + shippingCost + processingFee

    return { subtotal, tax, shippingCost, processingFee, total }
  }, [subtotal, selectedPaymentId, paymentOptions])

  const handlePlaceOrder = async () => {
    // Validation
    if (!selectedAddressId) {
      toast.error('Please select a shipping address')
      return
    }

    if (!selectedPaymentId) {
      toast.error('Please select a payment method')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsLoading(true)

    try {
      const result = await onPlaceOrder({
        addressId: selectedAddressId,
        paymentOptionId: selectedPaymentId,
        items: cartItems,
        totals,
      })

      if (result.success) {
        toast.success('Order placed successfully!')
        router.push(`/orders/${result.orderId}`)
      } else {
        toast.error(result.message || 'Failed to place order')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  // Show empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items to your cart to checkout</p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-2">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items ({cartItems.length})</h3>
            <div className="divide-y">
              {cartItems.map((item) => (
                <CheckoutItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-lg border p-6">
            <AddressSelector
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
            />
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-lg border p-6">
            <PaymentSelector
              paymentOptions={paymentOptions}
              selectedPaymentId={selectedPaymentId}
              onSelectPayment={setSelectedPaymentId}
            />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            {...totals}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isLoading}
            disabled={!selectedAddressId || !selectedPaymentId}
          />
        </div>
      </div>
    </div>
  )
}
