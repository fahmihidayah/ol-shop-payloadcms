/**
 * Email Service
 *
 * Provides methods to send transactional emails.
 * Uses PayloadCMS email adapter configured in email plugin.
 */

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Order, OrderItem, Customer } from '@/payload-types'
import { generateOrderConfirmationEmail } from './templates/order-confirmation'
import { generateOrderShippedEmail } from './templates/order-shipped'
import { generatePaymentConfirmationEmail } from './templates/payment-confirmation'
import { generateWelcomeEmail } from './templates/welcome-email'

export class EmailService {
  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(params: {
    order: Order
    orderItems: OrderItem[]
    customerEmail: string
    customerName: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = await getPayload({ config })

      const { subject, html, text } = generateOrderConfirmationEmail({
        order: params.order,
        orderItems: params.orderItems,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
      })

      await payload.sendEmail({
        to: params.customerEmail,
        subject,
        html,
        text,
      })

      console.log('[EMAIL_SERVICE] Order confirmation sent:', {
        orderNumber: params.order.orderNumber,
        to: params.customerEmail,
      })

      return { success: true }
    } catch (error) {
      console.error('[EMAIL_SERVICE] Failed to send order confirmation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }

  /**
   * Send order shipped notification
   */
  static async sendOrderShipped(params: {
    order: Order
    customerEmail: string
    customerName: string
    trackingNumber?: string
    courierName?: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = await getPayload({ config })

      const { subject, html, text } = generateOrderShippedEmail({
        order: params.order,
        customerName: params.customerName,
        trackingNumber: params.trackingNumber,
        courierName: params.courierName,
      })

      await payload.sendEmail({
        to: params.customerEmail,
        subject,
        html,
        text,
      })

      console.log('[EMAIL_SERVICE] Order shipped notification sent:', {
        orderNumber: params.order.orderNumber,
        to: params.customerEmail,
      })

      return { success: true }
    } catch (error) {
      console.error('[EMAIL_SERVICE] Failed to send shipped notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }

  /**
   * Send payment received confirmation
   */
  static async sendPaymentConfirmation(params: {
    order: Order
    customerEmail: string
    customerName: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = await getPayload({ config })

      const { subject, html, text } = generatePaymentConfirmationEmail({
        order: params.order,
        customerName: params.customerName,
      })

      await payload.sendEmail({
        to: params.customerEmail,
        subject,
        html,
        text,
      })

      console.log('[EMAIL_SERVICE] Payment confirmation sent:', {
        orderNumber: params.order.orderNumber,
        to: params.customerEmail,
      })

      return { success: true }
    } catch (error) {
      console.error('[EMAIL_SERVICE] Failed to send payment confirmation:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }

  /**
   * Send welcome email when user creates account
   */
  static async sendWelcomeEmail(params: {
    customerName: string
    customerEmail: string
    welcomeImageUrl?: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = await getPayload({ config })

      // Get company information from environment or defaults
      const companyName = process.env.EMAIL_FROM_NAME || 'Online Store'
      const companyAddress =
        process.env.COMPANY_ADDRESS || 'Your business address, City, Country'
      const companyContact =
        process.env.COMPANY_CONTACT || 'support@example.com | +1 (555) 123-4567'
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

      // Social links from environment or defaults
      const socialLinks = []
      if (process.env.SOCIAL_FACEBOOK) {
        socialLinks.push({ name: 'Facebook', url: process.env.SOCIAL_FACEBOOK })
      }
      if (process.env.SOCIAL_INSTAGRAM) {
        socialLinks.push({ name: 'Instagram', url: process.env.SOCIAL_INSTAGRAM })
      }
      if (process.env.SOCIAL_TWITTER) {
        socialLinks.push({ name: 'Twitter', url: process.env.SOCIAL_TWITTER })
      }

      const { subject, html, text } = generateWelcomeEmail({
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        companyName,
        companyAddress,
        companyContact,
        baseUrl,
        welcomeImageUrl: params.welcomeImageUrl,
        socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
      })

      await payload.sendEmail({
        to: params.customerEmail,
        subject,
        html,
        text,
      })

      console.log('[EMAIL_SERVICE] Welcome email sent:', {
        to: params.customerEmail,
      })

      return { success: true }
    } catch (error) {
      console.error('[EMAIL_SERVICE] Failed to send welcome email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }

  /**
   * Send generic email
   */
  static async sendEmail(params: {
    to: string | string[]
    subject: string
    html: string
    text?: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = await getPayload({ config })

      await payload.sendEmail({
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      })

      console.log('[EMAIL_SERVICE] Email sent:', {
        to: params.to,
        subject: params.subject,
      })

      return { success: true }
    } catch (error) {
      console.error('[EMAIL_SERVICE] Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }
}
