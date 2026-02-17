/**
 * Get a list of documents from the collection
 */

import { ServiceContext } from '@/types/service-context'
import { PaginatedDocs, Where } from 'payload'

export interface ServiceListOptions {
  where?: Where
  limit?: number
  page?: number
  sort?: string
  depth?: number
}
export async function getListService<T>({
  serviceContext,
  options = {},
}: {
  serviceContext: ServiceContext
  options: ServiceListOptions
}): Promise<PaginatedDocs<T>> {
  const { where, limit = 10, page = 1, sort, depth = 0 } = options

  const result = await serviceContext.payload.find({
    collection: serviceContext.collection,
    where,
    limit,
    page,
    sort,
    depth,
    overrideAccess: true,
  })

  return result as PaginatedDocs<T>
}
