import { CartPage } from '@/feature/cart/components/cart-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | Review Your Items | Online Store',
  description:
    'Review items in your shopping cart, update quantities, apply discount codes, and proceed to secure checkout. Free shipping on orders over a certain amount.',
  keywords: [
    'shopping cart',
    'cart',
    'checkout',
    'review order',
    'update cart',
    'apply coupon',
    'discount code',
    'online shopping',
  ],
  openGraph: {
    title: 'Shopping Cart | Online Store',
    description: 'Review your items and proceed to checkout securely.',
    type: 'website',
    url: '/cart',
  },
  robots: {
    index: false, // Cart pages should not be indexed
    follow: true,
  },
  alternates: {
    canonical: '/cart',
  },
}

export default function Cart() {
  return <CartPage />
}
