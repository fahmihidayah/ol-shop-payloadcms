import type { ApiMiddleware } from '.'

// No need for factory function since there are no parameters
export const withLogging: ApiMiddleware = (handler) => {
  return async (req) => {
    const start = Date.now()
    const url = new URL(req.url || '', 'http://localhost')
    const method = req.method || 'UNKNOWN'
    const userId = (req.user as any)?.id ?? 'anonymous'

    try {
      const response = await handler(req)
      const duration = Date.now() - start

      console.log(
        `[API] ${method} ${url.pathname} → ${response.status} (${duration}ms) user=${userId}`,
      )

      return response
    } catch (error) {
      const duration = Date.now() - start

      console.error(
        `[API] ${method} ${url.pathname} → 500 (${duration}ms) user=${userId}`,
        error instanceof Error ? error.message : error,
      )

      return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
  }
}
