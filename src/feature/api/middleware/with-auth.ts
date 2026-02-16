// src/api/middleware/withAuth.ts
import { addDataAndFileToRequest } from 'payload'
import { ApiMiddleware } from '.'

export const withAuth: ApiMiddleware = (handler) => {
  return async (req) => {
    if (!req.user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req)
  }
}
