/**
 * Order Confirmation Email Template
 */

import 'server-only'

import { Order, OrderItem } from '@/payload-types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { renderEmailTemplate, type EmailRenderResult } from '../template-renderer'

interface OrderConfirmationEmailData {
  order: Order
  orderItems: OrderItem[]
  customerName: string
  customerEmail: string
}

export function generateOrderConfirmationEmail(
  data: OrderConfirmationEmailData,
): EmailRenderResult {
  const { order, orderItems, customerName } = data

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Format order items with currency
  const formattedOrderItems = orderItems.map((item) => ({
    ...item,
    priceFormatted: formatCurrency(item.price),
    subtotalFormatted: formatCurrency(item.subtotal),
  }))

  // Render with Nunjucks template
  return renderEmailTemplate('order-confirmation-template.html', {
    subject: `Order Confirmation - ${order.orderNumber}`,
    headerTitle: 'Thank You for Your Order!',
    headerSubtitle: `Order #${order.orderNumber}`,
    companyName: process.env.EMAIL_FROM_NAME || 'Online Store',
    companyAddress: process.env.COMPANY_ADDRESS,
    companyContact: process.env.COMPANY_CONTACT,
    unsubscribeLink: `${baseUrl}/account/preferences`,
    themeColor: '#000000',
    themeColorDark: '#1a1a1a',
    // Template-specific data
    customerName,
    order,
    orderItems: formattedOrderItems,
    orderDate: formatDate(order.createdAt),
    paymentStatusLabel: getPaymentStatusLabel(order.paymentStatus),
    orderStatusLabel: getOrderStatusLabel(order.orderStatus),
    subtotalFormatted: formatCurrency((order.totalAmount || 0) - (order.shippingCost || 0)),
    shippingFormatted: formatCurrency(order.shippingCost || 0),
    totalFormatted: formatCurrency(order.totalAmount || 0),
    baseUrl,
  })
}

function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '<span style="color: #f59e0b;">Pending Payment</span>',
    paid: '<span style="color: #10b981;">Paid</span>',
    failed: '<span style="color: #ef4444;">Payment Failed</span>',
    refunded: '<span style="color: #6b7280;">Refunded</span>',
  }
  return labels[status] || status
}

function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '<span style="color: #f59e0b;">Pending</span>',
    processing: '<span style="color: #3b82f6;">Processing</span>',
    shipped: '<span style="color: #10b981;">Shipped</span>',
    delivered: '<span style="color: #10b981;">Delivered</span>',
    cancelled: '<span style="color: #ef4444;">Cancelled</span>',
  }
  return labels[status] || status
}
