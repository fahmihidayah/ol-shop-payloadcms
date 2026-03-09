import 'server-only'

import nunjucks from 'nunjucks'
import path from 'path'

// Configure Nunjucks
const templatePath = path.join(process.cwd(), 'public', 'email-templates')
const nunjucksEnv = nunjucks.configure(templatePath, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  noCache: process.env.NODE_ENV === 'development', // Cache in production
})

export interface EmailTemplateData {
  // Header
  subject: string
  headerTitle: string
  headerSubtitle?: string

  // Footer
  companyName: string
  companyAddress?: string
  companyContact?: string
  socialLinks?: Array<{ name: string; url: string }>
  unsubscribeLink?: string

  // Theme
  themeColor?: string // Primary theme color (default: #2563eb)
  themeColorDark?: string // Darker shade for gradients (default: #1d4ed8)

  // Template-specific data (passed through to child templates)
  [key: string]: any
}

export interface EmailRenderResult {
  html: string
  text: string
  subject: string
}

/**
 * Renders an email template using Nunjucks
 * @param templateName - Name of the template file (e.g., 'welcome-template.html')
 * @param data - Template data to populate
 * @returns Rendered HTML, plain text, and subject
 */
export function renderEmailTemplate(
  templateName: string,
  data: EmailTemplateData,
): EmailRenderResult {
  // Set default theme colors if not provided
  const templateData = {
    ...data,
    themeColor: data.themeColor || '#2563eb',
    themeColorDark: data.themeColorDark || '#1d4ed8',
  }

  // Render the template with Nunjucks
  const html = nunjucksEnv.render(templateName, templateData)

  // Generate plain text version
  const text = generatePlainText(html, data)

  return {
    html,
    text,
    subject: data.subject,
  }
}

/**
 * Generates a plain text version of the email from HTML
 */
function generatePlainText(html: string, data: EmailTemplateData): string {
  let text = `${data.headerTitle}\n`

  if (data.headerSubtitle) {
    text += `${data.headerSubtitle}\n`
  }

  text += '\n' + '='.repeat(60) + '\n\n'

  // Strip HTML tags for plain text
  const plainBody = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '') // Remove head
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '') // Remove header (already in headerTitle)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
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
 * Legacy compatibility: Escapes HTML special characters
 * (Nunjucks does this automatically, but kept for any custom use)
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
