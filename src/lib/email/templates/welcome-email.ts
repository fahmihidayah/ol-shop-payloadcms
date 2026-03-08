import {
  createButton,
  createDivider,
  createImage,
  renderEmailTemplate,
  type EmailRenderResult,
} from '../template-renderer'

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
    customerEmail,
    companyName,
    companyAddress,
    companyContact,
    baseUrl,
    welcomeImageUrl,
    socialLinks,
  } = data

  // Default welcome image if not provided
  const imageUrl =
    welcomeImageUrl || `${baseUrl}/images/welcome-banner.jpg`

  // Build body content
  let bodyContent = `
    <h2>Welcome to ${companyName}! 🎉</h2>

    ${createImage(imageUrl, 'Welcome to our store', 560)}

    <p>Hi ${customerName},</p>

    <p>
      Thank you for creating an account with us! We're thrilled to have you as part of our community.
      Your account has been successfully created with the email address: <strong>${customerEmail}</strong>
    </p>

    <p>
      Here's what you can do with your new account:
    </p>

    <ul style="color: #4b5563; font-size: 15px; line-height: 1.8;">
      <li>Track your orders in real-time</li>
      <li>Save your favorite items to wishlist</li>
      <li>Get exclusive discounts and early access to sales</li>
      <li>Manage your shipping addresses and payment methods</li>
      <li>View your order history and download invoices</li>
    </ul>

    ${createDivider()}

    <p style="text-align: center;">
      Ready to start shopping? Explore our latest collections and find something you'll love.
    </p>

    <div style="text-align: center;">
      ${createButton('Start Shopping', `${baseUrl}/products`)}
    </div>

    ${createDivider()}

    <p style="font-size: 14px; color: #6b7280;">
      <strong>Need help?</strong> Our customer support team is here to assist you.
      Feel free to reach out anytime at ${companyContact || 'support@example.com'}.
    </p>

    <p style="font-size: 14px; color: #6b7280;">
      Thank you for choosing ${companyName}. We look forward to serving you!
    </p>
  `

  return renderEmailTemplate({
    subject: `Welcome to ${companyName}!`,
    headerTitle: `Welcome Aboard!`,
    headerSubtitle: `Your account has been successfully created`,
    bodyContent,
    companyName,
    companyAddress,
    companyContact,
    socialLinks,
    unsubscribeLink: `${baseUrl}/account/preferences`,
  })
}
