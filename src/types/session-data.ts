import { User } from '@/payload-types'

export type SessionData = {
  token: string
  user: User
}
