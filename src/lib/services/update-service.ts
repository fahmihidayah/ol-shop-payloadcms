import { ServiceContext } from '@/types/service-context'

/**
 * Update a document by ID
 */
export async function updateService<F, T>({
  serviceContext,
  id,
  data,
  overrideAccess,
}: {
  serviceContext: ServiceContext
  id: string
  data: Partial<F>
  overrideAccess?: boolean
}): Promise<T | null> {
  try {
    const result = await serviceContext.payload.update({
      collection: serviceContext.collection,
      id,
      data: data as never,
      overrideAccess,
    })

    return result as T
  } catch (error) {
    console.error(`[${serviceContext.collection.toUpperCase()}_REPOSITORY] Update error:`, error)
    return null
  }
}
