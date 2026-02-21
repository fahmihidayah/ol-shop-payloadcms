import { notFound, redirect } from 'next/navigation'
import { getOrderDetail } from '@/feature/order/actions/detail'
import { OrderDetailPage } from '@/feature/order/components/detail/order-detail-page'
import { getMeUser } from '@/lib/customer-utils'
import { Metadata } from 'next'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const orderDetail = await getOrderDetail(id)

  if (!orderDetail) {
    return {
      title: 'Order Not Found | Online Store',
      description: 'The requested order could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { order } = orderDetail
  const orderNumber = order.orderNumber
  const totalAmount = formatCurrency(order.totalAmount || 0)
  const orderDate = formatDate(order.createdAt)

  return {
    title: `Order ${orderNumber} | Order Details | Online Store`,
    description: `View details for order ${orderNumber} placed on ${orderDate}. Total: ${totalAmount}. Track your order status, view items, and check delivery information.`,
    keywords: [
      'order details',
      'order tracking',
      'order status',
      'shipment tracking',
      'order information',
      orderNumber,
    ],
    openGraph: {
      title: `Order ${orderNumber} | Online Store`,
      description: `Order placed on ${orderDate} - ${totalAmount}`,
      type: 'website',
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function OrderDetail({ params }: OrderDetailPageProps) {
  const { id } = await params

  // Check authentication
  //   const { user } = await getMeUser()
  //   if (!user) {
  //     redirect('/login?redirect=/account/orders/' + id)
  //   }

  // Fetch order details
  const orderDetail = await getOrderDetail(id)

  if (!orderDetail) {
    notFound()
  }

  return <OrderDetailPage order={orderDetail.order} orderItems={orderDetail.orderItems} />
}
