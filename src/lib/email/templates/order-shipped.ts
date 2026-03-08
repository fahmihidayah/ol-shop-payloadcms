/**
 * Order Shipped Email Template
 */

import { Order } from '@/payload-types'
import { formatDate } from '@/lib/utils'

interface OrderShippedEmailData {
  order: Order
  customerName: string
  trackingNumber?: string
  courierName?: string
}

export function generateOrderShippedEmail(data: OrderShippedEmailData) {
  const { order, customerName, trackingNumber, courierName } = data

  const subject = `Your Order Has Shipped! - ${order.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #28a745;
      color: #fff;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px 20px;
      border: 1px solid #dee2e6;
      border-top: none;
    }
    .tracking-info {
      background: #e7f5ed;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .tracking-number {
      font-size: 24px;
      font-weight: 700;
      color: #28a745;
      margin: 10px 0;
      letter-spacing: 2px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #28a745;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 0;
    }
    .order-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📦 Your Order Is On The Way!</h1>
  </div>

  <div class="content">
    <p>Hi ${customerName},</p>

    <p>Great news! Your order <strong>${order.orderNumber}</strong> has been shipped and is on its way to you.</p>

    ${
      trackingNumber
        ? `
    <div class="tracking-info">
      <p style="margin: 0; font-size: 14px; color: #6c757d;">Tracking Number</p>
      <div class="tracking-number">${trackingNumber}</div>
      ${courierName ? `<p style="margin: 10px 0 0 0; font-size: 14px;">Courier: <strong>${courierName}</strong></p>` : ''}
    </div>
    `
        : ''
    }

    <div class="order-info">
      <table style="width: 100%;">
        <tr>
          <td style="width: 40%;"><strong>Order Number:</strong></td>
          <td>${order.orderNumber}</td>
        </tr>
        <tr>
          <td><strong>Shipped Date:</strong></td>
          <td>${formatDate(new Date())}</td>
        </tr>
      </table>
    </div>

    <h3>Shipping Address:</h3>
    <div class="order-info">
      <p style="margin: 0;">
        <strong>${order.shippingAddress?.recipientName}</strong><br>
        ${order.shippingAddress?.addressLine1}<br>
        ${order.shippingAddress?.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
        ${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.postalCode}<br>
        Phone: ${order.shippingAddress?.phone}
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${order.id}" class="button">
        Track Your Order
      </a>
    </div>

    <p style="color: #6c757d; font-size: 14px;">
      <strong>Estimated Delivery:</strong> Please check with the courier for estimated delivery time.
    </p>

    <p>Thank you for shopping with us!</p>

    <p>
      Best regards,<br>
      <strong>Online Store Team</strong>
    </p>
  </div>
</body>
</html>
  `

  const text = `
Your Order Has Shipped! - ${order.orderNumber}

Hi ${customerName},

Great news! Your order ${order.orderNumber} has been shipped and is on its way to you.

${trackingNumber ? `Tracking Number: ${trackingNumber}${courierName ? `\nCourier: ${courierName}` : ''}` : ''}

Shipping Address:
${order.shippingAddress?.recipientName}
${order.shippingAddress?.addressLine1}
${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.postalCode}
Phone: ${order.shippingAddress?.phone}

Track your order: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${order.id}

Thank you for shopping with us!

Best regards,
Online Store Team
  `

  return { subject, html, text }
}
