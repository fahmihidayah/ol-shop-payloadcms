'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Page } from '@/payload-types'
import { PageService } from '../services/page-service'

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  try {
    const payload = await getPayload({ config })

    const result = await PageService.findBySlug({
      context: {
        payload: payload,
      },
      slug,
    })

    return result.data ?? null
  } catch (error) {
    console.error('[GET_PAGE_BY_SLUG] Error:', error)
    return null
  }
}
