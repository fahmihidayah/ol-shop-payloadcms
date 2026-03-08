'use client'

import { useState, useTransition } from 'react'
import type { Address, CartItem, Customer, PaymentOption, Product } from '@/payload-types'
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

interface CheckoutPageProps {
  customer?: Customer
  addresses: Address[]
  items: CartItem[]
  totalItems: number
  shipingCost: number
  totalPrice: number
  paymentOptions: DuitkuPaymentMethod[]
}

export function CheckoutPageClient({
  customer,
  addresses,
  items,
  totalItems,
  shipingCost,
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
      const total = subtotal + shipingCost + tax

      // Log checkout data for debugging
      console.log('[CHECKOUT_PAGE] Preparing checkout data:')
      console.log('  Items:', checkoutItems)
      console.log('  totalPrice (from cart):', totalPrice)
      console.log('  subtotal:', subtotal)
      console.log('  shipingCost:', shipingCost)
      console.log('  tax:', tax)
      console.log('  total:', total)

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
        shipingCost,
        tax,
        total,
      }

      // Submit the order
      startTransition(async () => {
        const result = await processCheckout(checkoutData)

        if (result.success && result.reference) {
          toast.success('Order created successfully! Opening payment...')

          // Use Duitku Popup instead of redirect
          // @ts-ignore - Duitku checkout is loaded from external script
          if (typeof window.checkout !== 'undefined') {
            // @ts-ignore
            window.checkout.process(result.reference, {
              successEvent: function (paymentResult: any) {
                console.log('[DUITKU_POPUP] ✅ SUCCESS EVENT TRIGGERED')
                console.log('[DUITKU_POPUP] Payment success:', paymentResult)
                toast.success('Payment successful!')
                console.log('[DUITKU_POPUP] Redirecting via router.push to /order/confirmation')
                // Redirect to order confirmation
                router.push(
                  `/order/confirmation?merchantOrderId=${result.orderNumber}&resultCode=00&reference=${paymentResult.reference || result.reference}`,
                )
              },
              pendingEvent: function (paymentResult: any) {
                console.log('[DUITKU_POPUP] Payment pending:', paymentResult)
                toast.info('Payment is pending. Please complete your payment.')
                // Redirect to order confirmation with pending status
                router.push(
                  `/order/confirmation?merchantOrderId=${result.orderNumber}&resultCode=01&reference=${paymentResult.reference || result.reference}`,
                )
              },
              errorEvent: function (paymentResult: any) {
                console.error('[DUITKU_POPUP] Payment error:', paymentResult)
                toast.error('Payment failed. Please try again.')
                // Redirect to order confirmation with error status
                router.push(
                  `/order/confirmation?merchantOrderId=${result.orderNumber}&resultCode=02&reference=${paymentResult.reference || result.reference}`,
                )
              },
              closeEvent: function (paymentResult: any) {
                console.log('[DUITKU_POPUP] Payment popup closed:', paymentResult)
                toast.warning(
                  'Payment window closed. You can complete payment later from your orders.',
                )
                // Redirect to orders page
                router.push('/account/orders')
              },
            })
          } else {
            // Fallback to redirect if popup library not loaded
            console.warn(
              '[DUITKU_POPUP] Duitku checkout library not loaded, falling back to redirect',
            )
            toast.info('Redirecting to payment page...')
            window.location.href = result.paymentUrl || ''
          }
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
            customer={customer}
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
              shipping={shipingCost}
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
