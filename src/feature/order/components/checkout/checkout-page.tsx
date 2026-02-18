'use client'

import { useState, useTransition } from 'react'
import type { Address, CartItem, PaymentOption, Product } from '@/payload-types'
import { CheckoutAddressSelector } from './checkout-address-selector'
import { CheckoutCartSummary } from './checkout-cart-summary'
import { CheckoutPaymentOptions } from './checkout-payment-options'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { DuitkuPaymentMethod } from '@/types/duitku'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { CheckoutData, CheckoutItem } from '@/types/checkout'
import { processCheckout } from '../../actions/checkout'

const SHIPPING_COST = 20000

interface CheckoutPageProps {
  addresses: Address[]
  items: CartItem[]
  totalItems: number
  totalPrice: number
  paymentOptions: DuitkuPaymentMethod[]
}

export function CheckoutPageClient({
  addresses,
  items,
  totalItems,
  totalPrice,
  paymentOptions,
}: CheckoutPageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0]
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? '')
  const [selectedPaymentId, setSelectedPaymentId] = useState('')

  const canPlaceOrder = selectedAddressId && selectedPaymentId

  /**
   * Handle Place Order button click
   * Submits the order with selected payment method and shipping address
   */
  const handlePlaceOrder = async () => {
    try {
      // Find the selected address
      const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)
      if (!selectedAddress) {
        toast.error('Please select a shipping address')
        return
      }

      // Map CartItem[] to CheckoutItem[]
      const checkoutItems: CheckoutItem[] = items.map((item) => {
        const product = typeof item.product === 'object' ? item.product : null
        return {
          productId: typeof item.product === 'string' ? item.product : item.product.id,
          variantId: item.variant,
          productName: product?.name || 'Unknown Product',
          variantName: item.variant, // You may need to get the actual variant name
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }
      })

      // Calculate totals
      const subtotal = totalPrice
      const tax = 0 // Add tax calculation if needed

      // Build checkout data
      const checkoutData: CheckoutData = {
        items: [...checkoutItems],
        shippingAddress: {
          fullName: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          address: selectedAddress.addressLine1,
          city: selectedAddress.city,
          state: selectedAddress.province || undefined,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || 'ID',
        },
        paymentMethod: selectedPaymentId,
        subtotal,
        shippingCost: SHIPPING_COST,
        tax,
        total: subtotal + SHIPPING_COST + tax,
      }

      // Submit the order
      startTransition(async () => {
        const result = await processCheckout(checkoutData)

        if (result.success && result.paymentUrl) {
          toast.success('Order created successfully! Redirecting to payment...')
          // Redirect to Duitku payment page
          window.location.href = result.paymentUrl
        } else {
          toast.error(result.error || 'Failed to create order. Please try again.')
        }
      })
    } catch (error) {
      console.error('[PLACE_ORDER] Error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-1">Review your order and select shipping address</p>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Address + Payment */}
        <div className="flex-1 space-y-6">
          <CheckoutAddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddressId}
          />

          <CheckoutPaymentOptions
            paymentOptions={paymentOptions}
            selectedPaymentId={selectedPaymentId}
            onSelect={setSelectedPaymentId}
          />
        </div>

        {/* Right: Order summary */}
        <div className="w-full lg:w-[400px] space-y-4">
          <div className="lg:sticky lg:top-20 space-y-4">
            <CheckoutCartSummary
              items={items}
              totalItems={totalItems}
              totalPrice={totalPrice}
              shipping={SHIPPING_COST}
            />

            <Button
              size="lg"
              className="w-full"
              disabled={!canPlaceOrder || isPending}
              onClick={handlePlaceOrder}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                'Place Order'
              )}
            </Button>

            {!canPlaceOrder && (
              <p className="text-sm text-destructive text-center">
                {!selectedAddressId && !selectedPaymentId
                  ? 'Please select a shipping address and payment method.'
                  : !selectedAddressId
                    ? 'Please select a shipping address.'
                    : 'Please select a payment method.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
