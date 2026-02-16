// src/api/middleware/withRateLimit.ts

import { ApiMiddleware } from '.'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function withRateLimit(maxRequests: number, windowMs: number): ApiMiddleware {
  return (handler) => {
    return async (req) => {
      const key = (req.user as any)?.id || req.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()

      const entry = rateLimitMap.get(key)
      if (entry && now < entry.resetAt) {
        if (entry.count >= maxRequests) {
          return Response.json({ success: false, error: 'Too many requests' }, { status: 429 })
        }
        entry.count++
      } else {
        rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
      }

      return handler(req)
    }
  }
}
