import { OrderList } from '@/feature/account/components/orders/order-list'

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <OrderList />
    </div>
  )
}
