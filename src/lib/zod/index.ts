import { ZodError } from 'zod'

export function formatZodError(error: ZodError) {
  const formatted: Record<string, string> = {}

  for (const issue of error.issues) {
    const field = issue.path.join('.')

    // Only take first error per field
    if (!formatted[field]) {
      formatted[field] = issue.message
    }
  }

  return formatted
}
