/**
 * Order Confirmation Email Template
 */

import { Order, OrderItem } from '@/payload-types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrderConfirmationEmailData {
  order: Order
  orderItems: OrderItem[]
  customerName: string
  customerEmail: string
}

export function generateOrderConfirmationEmail(data: OrderConfirmationEmailData) {
  const { order, orderItems, customerName } = data

  const subject = `Order Confirmation - ${order.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #000;
      color: #fff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #fff;
      padding: 30px 20px;
    }
    .order-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .order-info table {
      width: 100%;
      border-collapse: collapse;
    }
    .order-info td {
      padding: 8px 0;
    }
    .order-info td:first-child {
      font-weight: 600;
      width: 40%;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }
    .total-row {
      font-weight: 600;
      font-size: 18px;
      background: #f8f9fa;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #000;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6c757d;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Thank You for Your Order!</h1>
  </div>

  <div class="content">
    <p>Hi ${customerName},</p>

    <p>Your order has been confirmed and will be processed shortly. Here are your order details:</p>

    <div class="order-info">
      <table>
        <tr>
          <td>Order Number:</td>
          <td><strong>${order.orderNumber}</strong></td>
        </tr>
        <tr>
          <td>Order Date:</td>
          <td>${formatDate(order.createdAt)}</td>
        </tr>
        <tr>
          <td>Payment Status:</td>
          <td>${getPaymentStatusLabel(order.paymentStatus)}</td>
        </tr>
        <tr>
          <td>Order Status:</td>
          <td>${getOrderStatusLabel(order.orderStatus)}</td>
        </tr>
      </table>
    </div>

    <h2>Order Items</h2>
    <table class="items-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${orderItems
          .map(
            (item) => `
        <tr>
          <td>${item.productSnapshot?.title || 'Product'}<br><small>${item.productSnapshot?.variantTitle || ''}</small></td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(item.subtotal)}</td>
        </tr>
        `,
          )
          .join('')}
        <tr>
          <td colspan="3" style="text-align: right; padding-top: 20px;"><strong>Subtotal:</strong></td>
          <td style="padding-top: 20px;">${formatCurrency((order.totalAmount || 0) - (order.shipingCost || 0))}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
          <td>${formatCurrency(order.shipingCost || 0)}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
          <td>${formatCurrency(order.totalAmount || 0)}</td>
        </tr>
      </tbody>
    </table>

    <h2>Shipping Address</h2>
    <div class="order-info">
      <p>
        <strong>${order.shippingAddress?.recipientName}</strong><br>
        ${order.shippingAddress?.addressLine1}<br>
        ${order.shippingAddress?.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
        ${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.postalCode}<br>
        ${order.shippingAddress?.country}<br>
        Phone: ${order.shippingAddress?.phone}
      </p>
    </div>

    ${
      order.paymentStatus === 'pending'
        ? `
    <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <strong>⚠️ Payment Pending</strong><br>
      Please complete your payment to process your order.
      ${order.vaNumber ? `<br><br><strong>Virtual Account Number:</strong> ${order.vaNumber}` : ''}
    </div>
    `
        : ''
    }

    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${order.id}" class="button">
        View Order Details
      </a>
    </div>

    <p>If you have any questions about your order, please don't hesitate to contact us.</p>

    <p>
      Best regards,<br>
      <strong>Online Store Team</strong>
    </p>
  </div>

  <div class="footer">
    <p>
      This is an automated email. Please do not reply to this message.<br>
      © ${new Date().getFullYear()} Online Store. All rights reserved.
    </p>
  </div>
</body>
</html>
  `

  const text = `
Order Confirmation - ${order.orderNumber}

Hi ${customerName},

Your order has been confirmed and will be processed shortly.

Order Details:
- Order Number: ${order.orderNumber}
- Order Date: ${formatDate(order.createdAt)}
- Payment Status: ${getPaymentStatusLabel(order.paymentStatus)}
- Order Status: ${getOrderStatusLabel(order.orderStatus)}

Order Items:
${orderItems
  .map(
    (item) =>
      `- ${item.productSnapshot?.title} (${item.quantity}x) - ${formatCurrency(item.subtotal)}`,
  )
  .join('\n')}

Subtotal: ${formatCurrency((order.totalAmount || 0) - (order.shipingCost || 0))}
Shipping: ${formatCurrency(order.shipingCost || 0)}
Total: ${formatCurrency(order.totalAmount || 0)}

Shipping Address:
${order.shippingAddress?.recipientName}
${order.shippingAddress?.addressLine1}
${order.shippingAddress?.addressLine2 || ''}
${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.postalCode}
${order.shippingAddress?.country}
Phone: ${order.shippingAddress?.phone}

${order.paymentStatus === 'pending' ? `Payment Pending - Please complete your payment to process your order.${order.vaNumber ? `\nVirtual Account Number: ${order.vaNumber}` : ''}` : ''}

View your order: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${order.id}

Best regards,
Online Store Team
  `

  return { subject, html, text }
}

function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pending Payment',
    paid: 'Paid',
    failed: 'Payment Failed',
    refunded: 'Refunded',
  }
  return labels[status] || status
}

function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return labels[status] || status
}
