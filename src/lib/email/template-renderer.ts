import fs from 'fs'
import path from 'path'

export interface EmailTemplateData {
  // Header
  subject: string
  headerTitle: string
  headerSubtitle?: string

  // Body
  bodyContent: string

  // Footer
  companyName: string
  companyAddress?: string
  companyContact?: string
  socialLinks?: Array<{ name: string; url: string }>
  unsubscribeLink?: string
}

export interface EmailRenderResult {
  html: string
  text: string
  subject: string
}

/**
 * Renders an email template with dynamic data
 * @param data - Email template data to populate
 * @returns Rendered HTML, plain text, and subject
 */
export function renderEmailTemplate(data: EmailTemplateData): EmailRenderResult {
  // Read the base template
  const templatePath = path.join(process.cwd(), 'public', 'email-templates', 'base-template.html')
  let html = fs.readFileSync(templatePath, 'utf-8')

  // Replace header
  html = html.replace('{{SUBJECT}}', escapeHtml(data.subject))
  html = html.replace('{{HEADER_TITLE}}', escapeHtml(data.headerTitle))

  const headerSubtitle = data.headerSubtitle
    ? `<p>${escapeHtml(data.headerSubtitle)}</p>`
    : ''
  html = html.replace('{{HEADER_SUBTITLE}}', headerSubtitle)

  // Replace body content
  html = html.replace('{{BODY_CONTENT}}', data.bodyContent)

  // Replace footer
  html = html.replace(/{{COMPANY_NAME}}/g, escapeHtml(data.companyName))

  const companyAddress = data.companyAddress
    ? escapeHtml(data.companyAddress)
    : 'Your business address'
  html = html.replace('{{COMPANY_ADDRESS}}', companyAddress)

  const companyContact = data.companyContact
    ? escapeHtml(data.companyContact)
    : 'support@example.com | +1 (555) 123-4567'
  html = html.replace('{{COMPANY_CONTACT}}', companyContact)

  // Replace social links
  const socialLinks = data.socialLinks && data.socialLinks.length > 0
    ? data.socialLinks
        .map(
          (link) =>
            `<a href="${escapeHtml(link.url)}" style="color: #6b7280;">${escapeHtml(link.name)}</a>`,
        )
        .join(' • ')
    : ''
  html = html.replace('{{SOCIAL_LINKS}}', socialLinks)

  const unsubscribeLink = data.unsubscribeLink || '#'
  html = html.replace('{{UNSUBSCRIBE_LINK}}', escapeHtml(unsubscribeLink))

  // Generate plain text version
  const text = generatePlainText(data)

  return {
    html,
    text,
    subject: data.subject,
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Generates a plain text version of the email
 */
function generatePlainText(data: EmailTemplateData): string {
  let text = `${data.headerTitle}\n`

  if (data.headerSubtitle) {
    text += `${data.headerSubtitle}\n`
  }

  text += '\n' + '='.repeat(60) + '\n\n'

  // Strip HTML tags from body content for plain text
  const plainBody = data.bodyContent
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()

  text += plainBody + '\n\n'
  text += '='.repeat(60) + '\n\n'
  text += `${data.companyName}\n`

  if (data.companyAddress) {
    text += `${data.companyAddress}\n`
  }

  if (data.companyContact) {
    text += `${data.companyContact}\n`
  }

  if (data.socialLinks && data.socialLinks.length > 0) {
    text += '\nFollow us:\n'
    data.socialLinks.forEach((link) => {
      text += `${link.name}: ${link.url}\n`
    })
  }

  return text
}

/**
 * Helper function to create a button HTML
 */
export function createButton(text: string, url: string): string {
  return `<a href="${escapeHtml(url)}" class="button">${escapeHtml(text)}</a>`
}

/**
 * Helper function to create an image HTML
 */
export function createImage(src: string, alt: string, width?: number): string {
  const widthAttr = width ? `width="${width}"` : ''
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" ${widthAttr} style="max-width: 100%; height: auto; display: block; margin: 20px auto;" />`
}

/**
 * Helper function to create a divider
 */
export function createDivider(): string {
  return '<div class="divider"></div>'
}
