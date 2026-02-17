import { ServiceContext } from '@/types/service-context'
import { Where } from 'payload'

/**
 * Count documents in the collection
 */
export async function countService({
  serviceContext,
  where,
}: {
  serviceContext: ServiceContext
  where?: Where
}): Promise<number> {
  try {
    const result = await serviceContext.payload.count({
      collection: serviceContext.collection,
      where,
      overrideAccess: true,
    })

    return result.totalDocs
  } catch (error) {
    console.error(`[${serviceContext.collection.toUpperCase()}_REPOSITORY] Count error:`, error)
    return 0
  }
}
