// src/api/middleware/withValidation.ts
import { addDataAndFileToRequest } from 'payload'
import { ZodObject } from 'zod'
import { formatZodError } from '@/lib/zod'
import { ApiMiddleware } from '.'
import { EnhancedRequest } from '@/feature/api/types/request'

export function withValidation(zodObject: ZodObject<any>): ApiMiddleware {
  return (handler) => {
    return async (req) => {
      await addDataAndFileToRequest(req)

      const requestData = req.data
      console.log('request data : ', requestData)

      if (!requestData || Object.keys(requestData).length === 0) {
        return Response.json({ success: false, error: 'Request body is required' }, { status: 400 })
      }

      const validated = zodObject.safeParse(requestData)

      if (!validated.success) {
        return Response.json(
          { success: false, error: formatZodError(validated.error) },
          { status: 400 },
        )
      }

      ;(req as EnhancedRequest).validatedData = validated.data

      return handler(req)
    }
  }
}
