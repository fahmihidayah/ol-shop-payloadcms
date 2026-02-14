import { CartPage } from '@/feature/cart/components/cart-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | Online Store',
  description: 'Review your shopping cart and proceed to checkout',
}

export default function Cart() {
  return <CartPage />
}
