import { Customer } from '@/payload-types'

export type SessionData = {
  token: string
  user: Customer
}

export type CustomerSessionData = SessionData
