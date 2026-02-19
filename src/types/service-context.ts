'use server'
import { EnhancedRequest } from '@/feature/api/types/request'
import { Customer, User } from '@/payload-types'
import { CollectionSlug, getPayload, Payload } from 'payload'
import config from '@payload-config'
export type ServiceContext = {
  payload: Payload
  user?: Customer | User
  sessionId?: string
}

export async function createServiceContext({
  req,
  user,
  sessionId,
}: {
  req?: EnhancedRequest
  user?: Customer | User
  sessionId?: string
}): Promise<ServiceContext> {
  return {
    payload: req ? req.payload : await getPayload({ config }),
    user: user ? user : (req?.user ?? undefined),
    sessionId: sessionId ? sessionId : (req?.sessionId ?? undefined),
  }
}
