'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Page } from '@/payload-types'

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'pages',
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return null
    }

    return result.docs[0] as Page
  } catch (error) {
    console.error('[GET_PAGE_BY_SLUG] Error:', error)
    return null
  }
}
