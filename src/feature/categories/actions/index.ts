import { getPayload } from 'payload'
import config from '@payload-config'
import { Category } from '@/payload-types'

export const getCategories = async (): Promise<Category[]> => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
    })
    return result.docs
  } catch {
    return []
  }
}
