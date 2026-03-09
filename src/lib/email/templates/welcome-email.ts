import 'server-only'

import { renderEmailTemplate, type EmailRenderResult } from '../template-renderer'

export interface WelcomeEmailData {
  customerName: string
  customerEmail: string
  companyName: string
  companyAddress?: string
  companyContact?: string
  baseUrl: string
  welcomeImageUrl?: string
  socialLinks?: Array<{ name: string; url: string }>
}

/**
 * Generates a welcome email for new user accounts
 * @param data - Welcome email data
 * @returns Email with HTML, text, and subject
 */
export function generateWelcomeEmail(data: WelcomeEmailData): EmailRenderResult {
  const {
    customerName,
    companyName,
    companyAddress,
    companyContact,
    baseUrl,
    welcomeImageUrl,
    socialLinks,
  } = data

  return renderEmailTemplate('welcome-template.html', {
    subject: `Welcome to ${companyName}!`,
    headerTitle: 'Welcome Aboard!',
    headerSubtitle: 'Your account has been successfully created',
    companyName,
    companyAddress,
    companyContact,
    socialLinks,
    unsubscribeLink: `${baseUrl}/account/preferences`,
    // Template-specific data
    customerName,
    baseUrl,
    welcomeImageUrl,
  })
}
