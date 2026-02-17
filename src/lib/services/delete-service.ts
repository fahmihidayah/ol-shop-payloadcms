import { ServiceContext } from '@/types/service-context'

/**
 * Delete a document by ID
 */
export async function deleteService<T>({
  serviceContext,
  id,
  overrideAccess,
}: {
  serviceContext: ServiceContext
  id: string
  overrideAccess?: boolean
}): Promise<T | null> {
  try {
    const data = await serviceContext.payload.delete({
      collection: serviceContext.collection,
      id,
      overrideAccess,
    })

    return data as T
  } catch (error) {
    console.error(`[${serviceContext.collection.toUpperCase()}_REPOSITORY] Delete error:`, error)
    return null
  }
}
