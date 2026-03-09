/**
 * Payment Confirmation Email Template
 */

import 'server-only'

import { Order } from '@/payload-types'
import { formatDate } from '@/lib/utils'
import { renderEmailTemplate, type EmailRenderResult } from '../template-renderer'

interface PaymentConfirmationEmailData {
  order: Order
  customerName: string
}

export function generatePaymentConfirmationEmail(
  data: PaymentConfirmationEmailData,
): EmailRenderResult {
  const { order, customerName } = data

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Render with Nunjucks template
  return renderEmailTemplate('payment-confirmation-template.html', {
    subject: `Payment Received - ${order.orderNumber}`,
    headerTitle: '✅ Payment Confirmed!',
    headerSubtitle: `Order #${order.orderNumber}`,
    companyName: process.env.EMAIL_FROM_NAME || 'Online Store',
    companyAddress: process.env.COMPANY_ADDRESS,
    companyContact: process.env.COMPANY_CONTACT,
    unsubscribeLink: `${baseUrl}/account/preferences`,
    themeColor: '#10b981',
    themeColorDark: '#059669',
    // Template-specific data
    customerName,
    order,
    paymentDate: formatDate(new Date()),
    baseUrl,
  })
}
