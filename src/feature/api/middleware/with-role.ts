// src/api/middleware/withRole.ts

import { ApiMiddleware } from '.'

export function withRole(...roles: string[]): ApiMiddleware {
  return (handler) => {
    return async (req) => {
      const userRole = (req.user as any)?.role

      if (!userRole || !roles.includes(userRole)) {
        return Response.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }

      return handler(req)
    }
  }
}
