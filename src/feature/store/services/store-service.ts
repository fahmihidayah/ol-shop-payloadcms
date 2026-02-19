import { ServiceContext } from '@/types/service-context'

export const StoreService = {
  getStore: async ({ context }: { context: ServiceContext }) => {
    return await context.payload.findGlobal({
      slug: 'store-config',
    })
  },
}
