import { Page } from '@/payload-types'
import { ServiceContext } from '@/types/service-context'
import { ServiceResult } from '@/types/service-result'

export const PageService = {
  findBySlug: async ({
    context,
    slug,
  }: {
    context: ServiceContext
    slug: string
  }): Promise<ServiceResult<Page>> => {
    const result = await context.payload.find({
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
      return {
        error: true,
        message: 'Page not found',
      }
    }
    return {
      data: result.docs[0],
    }
  },
}
