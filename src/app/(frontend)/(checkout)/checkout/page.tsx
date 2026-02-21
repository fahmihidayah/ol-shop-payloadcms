import { getCart } from '@/feature/cart/actions'
import { getListAddresses } from '@/feature/account/actions/addresses/get-list-address'
import { getCombinedPaymentOptions } from '@/feature/order/actions/checkout/payment-options'
// import { CheckoutPageClient } from '@/feature/checkout/components/checkout-page'
import { redirect } from 'next/navigation'
import { CheckoutPageClient } from '@/feature/order/components/checkout/checkout-page'
import { getMeUser } from '@/lib/customer-utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Checkout | Complete Your Order | Online Store',
  description:
    'Complete your purchase securely. Choose your shipping address, select payment method, and finalize your order. Multiple payment options available including credit card, bank transfer, and e-wallets.',
  keywords: [
    'checkout',
    'secure checkout',
    'complete order',
    'payment',
    'shipping',
    'order summary',
    'secure payment',
    'buy now',
  ],
  openGraph: {
    title: 'Secure Checkout | Online Store',
    description: 'Complete your purchase securely with multiple payment options.',
    type: 'website',
    url: '/checkout',
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/checkout',
  },
}

export default async function CheckoutPage() {
  const [cart, addresses, user] = await Promise.all([getCart(), getListAddresses(), getMeUser()])

  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  // Get Duitku payment methods based on cart total
  const paymentOptions = await getCombinedPaymentOptions(cart.totalPrice)

  return (
    <CheckoutPageClient
      customer={user.user}
      addresses={addresses}
      items={cart.items}
      totalItems={cart.totalItems}
      totalPrice={cart.totalPrice}
      shipingCost={cart.shipping}
      paymentOptions={paymentOptions}
    />
  )
}
