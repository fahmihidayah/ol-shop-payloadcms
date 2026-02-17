import { ServiceContext } from '@/types/service-context'
import { Where } from 'payload'

/**
 * Find a single document by where clause
 */
export async function findOneService<T>({
  serviceContext,
  where,
  depth,
}: {
  serviceContext: ServiceContext
  where: Where
  depth?: number
}): Promise<T | null> {
  try {
    const result = await serviceContext.payload.find({
      collection: serviceContext.collection,
      where,
      limit: 1,
      depth: depth ?? 0,
      overrideAccess: true,
    })

    if (result.docs.length === 0) {
      return null
    }

    return result.docs[0] as T
  } catch (error) {
    console.error(`[${serviceContext.collection.toUpperCase()}_REPOSITORY] FindOne error:`, error)
    return null
  }
}
