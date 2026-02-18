import { Category } from '@/payload-types'
import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'

export const CategoryService = {
  findAll: async ({
    serviceContext,
  }: {
    serviceContext: ServiceContext
  }): Promise<ServiceResult<Category[]>> => {
    const categoriesDoc = await serviceContext.payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
    })
    return {
      data: categoriesDoc.docs,
    }
  },
}
