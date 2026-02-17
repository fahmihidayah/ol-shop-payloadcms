import { ServiceContext } from '@/types/service-context'

export async function createService<F, D>({
  serviceContext,
  data,
  overrideAccess,
}: {
  serviceContext: ServiceContext
  data: F
  overrideAccess?: boolean
}): Promise<D> {
  const result = await serviceContext.payload.create({
    collection: serviceContext.collection,
    data: data as never,
    overrideAccess,
  })

  return result as D
}
