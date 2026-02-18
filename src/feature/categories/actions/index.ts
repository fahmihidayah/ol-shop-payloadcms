import { getPayload } from 'payload'
import config from '@payload-config'
import { Category } from '@/payload-types'
import { CategoryService } from '../services/category-service'

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await CategoryService.findAll({
      serviceContext: {
        collection: 'categories',
        payload: await getPayload({
          config,
        }),
      },
    })
    return categories.data ?? []
  } catch {
    return []
  }
}
