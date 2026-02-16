// src/middleware/withQueryParams.ts
import { formatZodError } from '@/lib/zod'
import type { ApiMiddleware } from '.'
import type { EnhancedRequest } from '@/feature/api/types/request'
import { ZodObject } from 'zod'

export function withQueryParams(schema: ZodObject<any>): ApiMiddleware {
  return (handler) => {
    return async (req) => {
      const url = new URL(req.url || '', 'http://localhost')
      const raw: Record<string, any> = {}

      for (const [key, value] of url.searchParams.entries()) {
        // Handle comma-separated values as arrays
        if (value.includes(',')) {
          raw[key] = value.split(',')
        } else {
          raw[key] = value
        }
      }

      const validated = schema.safeParse(raw)

      if (!validated.success) {
        return Response.json(
          { success: false, error: formatZodError(validated.error) },
          { status: 400 },
        )
      }

      ;(req as EnhancedRequest).queryParams = validated.data

      return handler(req)
    }
  }
}
