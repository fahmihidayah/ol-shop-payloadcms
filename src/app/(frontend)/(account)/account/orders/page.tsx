import { OrderList } from '@/feature/account/components/orders/order-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders | Order History | Online Store',
  description:
    'View your complete order history, track active shipments, check order status, and manage returns. Access all your past and current orders in one place.',
  keywords: [
    'order history',
    'my orders',
    'track orders',
    'order status',
    'past orders',
    'order tracking',
    'shipment tracking',
  ],
  openGraph: {
    title: 'My Orders | Online Store',
    description: 'Track and manage all your orders from one convenient dashboard.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <OrderList />
    </div>
  )
}
