// src/api/middleware/compose.ts
import { Endpoint, PayloadHandler } from 'payload'
import { withJsonResponse } from './with-json-response'

// src/middleware/types.ts
import { PayloadRequest } from 'payload'

// Handler that can return plain objects instead of Response
export type ApiHandler = (req: PayloadRequest) => Promise<any>

export type ApiMiddleware = (handler: PayloadHandler) => PayloadHandler

export function composeMiddleware(...middlewares: ApiMiddleware[]) {
  return (handler: ApiHandler): Endpoint['handler'] => {
    // withJsonResponse converts plain objects to Response
    // so after it runs, the return type satisfies PayloadHandler
    const chain = [withJsonResponse, ...middlewares]
    return chain.reduceRight((acc, mw) => mw(acc), handler as PayloadHandler)
  }
}
