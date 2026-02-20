import { StoreConfig } from '@/payload-types'

export const calculateShiping = async ({ store }: { store: StoreConfig }) => {
  return store.defaultShippingCost ?? 0
}
