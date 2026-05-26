import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'h2', 'h3', 'ul', 'ol', 'li',
  'a', 'img', 'figure', 'figcaption', 'blockquote', 'code', 'pre']
const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'target', 'rel', 'class']

export function useSanitize() {
  function sanitize(html: string): string {
    if (import.meta.server) return html
    return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
  }
  return { sanitize }
}
