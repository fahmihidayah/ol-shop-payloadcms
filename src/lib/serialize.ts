/**
 * Serialize rich text content from PayloadCMS to HTML
 * This is a basic serializer - you may need to enhance it based on your rich text structure
 */
export function serialize(content: any): string {
  if (!content) return ''

  // If content is already a string, return it
  if (typeof content === 'string') return content

  // If content has a root property (Lexical format)
  if (content.root) {
    return serializeLexical(content.root)
  }

  // Fallback: return as string
  return String(content)
}

function serializeLexical(node: any): string {
  if (!node || !node.children) return ''

  return node.children
    .map((child: any) => {
      if (child.type === 'paragraph') {
        const content = serializeChildren(child.children)
        return `<p>${content}</p>`
      }

      if (child.type === 'heading') {
        const tag = child.tag || 'h2'
        const content = serializeChildren(child.children)
        return `<${tag}>${content}</${tag}>`
      }

      if (child.type === 'list') {
        const tag = child.listType === 'number' ? 'ol' : 'ul'
        const items = child.children
          .map((item: any) => `<li>${serializeChildren(item.children)}</li>`)
          .join('')
        return `<${tag}>${items}</${tag}>`
      }

      if (child.type === 'text') {
        return formatText(child)
      }

      return ''
    })
    .join('')
}

function serializeChildren(children: any[]): string {
  if (!children) return ''

  return children
    .map((child: any) => {
      if (child.type === 'text') {
        return formatText(child)
      }

      if (child.type === 'link') {
        const content = serializeChildren(child.children)
        const url = child.url || '#'
        return `<a href="${url}" target="${child.newTab ? '_blank' : '_self'}">${content}</a>`
      }

      return serializeLexical(child)
    })
    .join('')
}

function formatText(node: any): string {
  let text = node.text || ''

  if (node.format) {
    if (node.format & 1) text = `<strong>${text}</strong>` // Bold
    if (node.format & 2) text = `<em>${text}</em>` // Italic
    if (node.format & 4) text = `<s>${text}</s>` // Strikethrough
    if (node.format & 8) text = `<u>${text}</u>` // Underline
    if (node.format & 16) text = `<code>${text}</code>` // Code
  }

  return text
}
