import { User } from '@/payload-types'
import { CollectionSlug, Payload } from 'payload'

export type ServiceContext = {
  collection: CollectionSlug
  payload: Payload
}
