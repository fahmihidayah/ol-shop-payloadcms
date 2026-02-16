// src/api/middleware/types.ts
import { PayloadRequest } from 'payload'

// Extend request to carry middleware data
export type EnhancedRequest = PayloadRequest & {
  validatedData?: any
  queryParams?: any
  sessionId?: string
}
