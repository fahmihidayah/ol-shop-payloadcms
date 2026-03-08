# Email Setup Guide

This guide explains how to configure email sending functionality in the application.

## Overview

The email system supports multiple providers and is configured through environment variables. The implementation uses PayloadCMS's email adapter system with a plugin architecture.

## Architecture

- **Plugin**: [src/plugins/email/index.ts](src/plugins/email/index.ts)
- **Configuration**: [src/plugins/email/config.ts](src/plugins/email/config.ts)
- **Service**: [src/lib/email/email-service.ts](src/lib/email/email-service.ts)
- **Templates**: [src/lib/email/templates/](src/lib/email/templates/)
- **Template Renderer**: [src/lib/email/template-renderer.ts](src/lib/email/template-renderer.ts)
- **Base Template**: [public/email-templates/base-template.html](public/email-templates/base-template.html)

## Supported Providers

### 1. Console (Development)

Logs emails to console instead of sending them. Perfect for local development.

**Configuration:**

```env
EMAIL_PROVIDER=console
EMAIL_FROM_NAME=Online Store
EMAIL_FROM_ADDRESS=noreply@example.com
```

**No additional setup required.** Emails will be logged to console with full content.

### 2. Resend (Recommended for Production)

Modern email API with excellent deliverability and developer experience.

**Steps:**

1. Sign up at [https://resend.com](https://resend.com)
2. Create an API key in your dashboard
3. Verify your domain (for production) or use their test domain (for development)

**Configuration:**

```env
EMAIL_PROVIDER=resend
EMAIL_FROM_NAME=Your Store Name
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

**Installation:**

```bash
pnpm add @payloadcms/email-resend resend
```

**Pricing:**
- Free tier: 3,000 emails/month
- Pay-as-you-go: $1/1,000 emails

### 3. NodeMailer (SMTP)

Use any SMTP provider (Gmail, SendGrid, Mailgun, etc.)

**Configuration:**

```env
EMAIL_PROVIDER=nodemailer
EMAIL_FROM_NAME=Your Store Name
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Installation:**

```bash
pnpm add @payloadcms/email-nodemailer nodemailer
```

**Gmail Setup:**

1. Enable 2-factor authentication in your Google account
2. Generate an App Password:
   - Go to Google Account Settings > Security
   - Under "2-Step Verification", find "App passwords"
   - Create a new app password for "Mail"
3. Use the generated password in `SMTP_PASS`

**Other SMTP Providers:**

- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.us-east-1.amazonaws.com:587`

## Email Templates

### Template System

The application uses a **dynamic template rendering system** with a reusable base template:

- **Base Template**: [public/email-templates/base-template.html](public/email-templates/base-template.html)
  - Professional design with blue header theme
  - White body with clear, readable text
  - Configurable footer with company information
  - Fully responsive for mobile devices

- **Template Renderer**: [src/lib/email/template-renderer.ts](src/lib/email/template-renderer.ts)
  - `renderEmailTemplate()` - Renders emails with dynamic data
  - `createButton()` - Helper to create styled buttons
  - `createImage()` - Helper to add images to emails
  - `createDivider()` - Helper to add visual separators
  - Automatically generates plain text versions

### Available Email Templates

1. **Welcome Email** - [welcome-email.ts](src/lib/email/templates/welcome-email.ts)
   - Sent when user creates a new account
   - Includes welcome image/banner
   - Lists account benefits and features
   - Call-to-action button to start shopping

2. **Order Confirmation** - [order-confirmation.ts](src/lib/email/templates/order-confirmation.ts)
   - Sent when order is created
   - Includes order details, items, shipping address

3. **Order Shipped** - [order-shipped.ts](src/lib/email/templates/order-shipped.ts)
   - Sent when order status changes to shipped
   - Includes tracking number and courier information

4. **Payment Confirmation** - Inline in EmailService
   - Sent when payment is verified
   - Simple confirmation message

### Creating Custom Email Templates

You can easily create new email templates using the renderer:

```typescript
import { renderEmailTemplate, createButton, createImage } from '@/lib/email/template-renderer'

const { html, text, subject } = renderEmailTemplate({
  subject: 'Your Custom Email',
  headerTitle: 'Hello Customer!',
  headerSubtitle: 'Optional subtitle text',
  bodyContent: `
    <h2>Custom Content</h2>
    <p>Your email content here...</p>
    ${createImage('https://example.com/image.jpg', 'Description', 560)}
    <div style="text-align: center;">
      ${createButton('Click Here', 'https://example.com')}
    </div>
  `,
  companyName: 'Your Company',
  companyAddress: '123 Main St, City, Country',
  companyContact: 'support@company.com | +1 (555) 123-4567',
  socialLinks: [
    { name: 'Facebook', url: 'https://facebook.com/yourpage' },
    { name: 'Instagram', url: 'https://instagram.com/yourpage' },
  ],
  unsubscribeLink: 'https://example.com/unsubscribe',
})
```

## Using the Email Service

### Send Order Confirmation

```typescript
import { EmailService } from '@/lib/email/email-service'

await EmailService.sendOrderConfirmation({
  order: orderObject,
  orderItems: orderItemsArray,
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
})
```

### Send Order Shipped Notification

```typescript
await EmailService.sendOrderShipped({
  order: orderObject,
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  trackingNumber: 'TRACK123456',
  courierName: 'JNE',
})
```

### Send Welcome Email (New User)

```typescript
await EmailService.sendWelcomeEmail({
  customerName: 'John Doe',
  customerEmail: 'customer@example.com',
  welcomeImageUrl: 'https://yourdomain.com/images/welcome-banner.jpg', // Optional
})
```

### Send Payment Confirmation

```typescript
await EmailService.sendPaymentConfirmation({
  order: orderObject,
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
})
```

### Send Generic Email

```typescript
await EmailService.sendEmail({
  to: 'customer@example.com',
  subject: 'Your Subject',
  html: '<p>HTML content</p>',
  text: 'Plain text content',
})
```

## Testing

### Local Development

Use the `console` provider to test email flow without sending real emails:

```env
EMAIL_PROVIDER=console
```

All emails will be logged to your terminal with full HTML and text content.

### Testing with Real Emails

1. Use Resend's test mode (no domain verification required)
2. Or use a service like [Mailtrap](https://mailtrap.io) for SMTP testing

```env
EMAIL_PROVIDER=nodemailer
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
```

## Integration Points

The email service is called automatically at these points:

1. **New User Registration** - After user creates account
   - Location: To be implemented in user registration flow
   - Trigger: After successful account creation
   - Template: Welcome Email with image

2. **Order Creation** - After successful checkout
   - Location: [src/feature/order/actions/checkout/create-payment.ts](src/feature/order/actions/checkout/create-payment.ts)
   - Trigger: After order is created
   - Template: Order Confirmation

3. **Payment Verification** - When Duitku callback confirms payment
   - Location: [src/feature/order/actions/order-confirmation/update-order.ts](src/feature/order/actions/order-confirmation/update-order.ts)
   - Trigger: In `updateOrderFromCallback()` when payment is successful
   - Template: Payment Confirmation

4. **Order Shipped** - Manual trigger from admin panel
   - Location: Order status update hook (to be implemented)
   - Trigger: When order status changes to "shipped"
   - Template: Order Shipped with tracking

## Troubleshooting

### Emails Not Sending

1. Check provider configuration in `.env`
2. Verify API keys/credentials are correct
3. Check console logs for error messages
4. Ensure `emailPlugin()` is registered in `payload.config.ts`

### Gmail "Less Secure Apps" Error

Gmail no longer supports "less secure apps". You must use an App Password:
1. Enable 2FA on your Google account
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

### Domain Verification (Resend/Production)

For production use with Resend:
1. Add DNS records to verify your domain
2. Use your verified domain in `EMAIL_FROM_ADDRESS`
3. Test with their verification tool

### Rate Limits

- **Resend Free**: 3,000 emails/month
- **Gmail**: 500 emails/day
- **SendGrid Free**: 100 emails/day

Consider upgrading or using a transactional email service for production.

## Security Best Practices

1. **Never commit `.env` file** - Only commit `.env.example`
2. **Use App Passwords** - Never use main account passwords
3. **Rotate API Keys** - Regularly rotate Resend/SendGrid API keys
4. **Monitor Usage** - Set up alerts for unusual email volumes
5. **Verify Domains** - Use verified domains in production

## Environment Variables Reference

### Email Provider Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_PROVIDER` | No | `console` | Email provider: `resend`, `nodemailer`, or `console` |
| `EMAIL_FROM_NAME` | No | `Online Store` | Sender name displayed in emails |
| `EMAIL_FROM_ADDRESS` | No | `noreply@example.com` | Sender email address |
| `RESEND_API_KEY` | If using Resend | - | Resend API key from dashboard |
| `SMTP_HOST` | If using NodeMailer | - | SMTP server hostname |
| `SMTP_PORT` | If using NodeMailer | - | SMTP server port (usually 587) |
| `SMTP_SECURE` | No | `false` | Use TLS (true for port 465) |
| `SMTP_USER` | If using NodeMailer | - | SMTP username/email |
| `SMTP_PASS` | If using NodeMailer | - | SMTP password/app password |

### Email Template Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `COMPANY_ADDRESS` | No | `Your business address` | Physical address for email footer |
| `COMPANY_CONTACT` | No | `support@example.com` | Contact info for email footer |
| `SOCIAL_FACEBOOK` | No | - | Facebook page URL |
| `SOCIAL_INSTAGRAM` | No | - | Instagram profile URL |
| `SOCIAL_TWITTER` | No | - | Twitter profile URL |

### Example .env Configuration

```env
# Email Provider
EMAIL_PROVIDER=console
EMAIL_FROM_NAME=My Online Store
EMAIL_FROM_ADDRESS=noreply@mystore.com

# Company Information (for email templates)
COMPANY_ADDRESS=123 Main Street, Jakarta, Indonesia
COMPANY_CONTACT=support@mystore.com | +62 21 1234 5678

# Social Media Links (optional)
SOCIAL_FACEBOOK=https://facebook.com/mystore
SOCIAL_INSTAGRAM=https://instagram.com/mystore
SOCIAL_TWITTER=https://twitter.com/mystore

# Resend (if using)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# SMTP (if using NodeMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Production Checklist

- [ ] Choose and configure production email provider (Resend recommended)
- [ ] Verify domain with email provider
- [ ] Update `EMAIL_FROM_ADDRESS` to use verified domain
- [ ] Update `EMAIL_FROM_NAME` to match brand
- [ ] Configure company information (`COMPANY_ADDRESS`, `COMPANY_CONTACT`)
- [ ] Add social media links (optional)
- [ ] Add welcome banner image to `/public/images/welcome-banner.jpg`
- [ ] Test all email templates with real data
- [ ] Set up monitoring/alerts for email deliverability
- [ ] Configure SPF, DKIM, DMARC records for domain
- [ ] Review and comply with anti-spam regulations (CAN-SPAM, GDPR)
- [ ] Implement welcome email trigger in user registration flow
