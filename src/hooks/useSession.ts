'use client'

import { useQuery } from '@tanstack/react-query'
import { User } from '@/payload-types'

type SessionData = {
  token: string
  user: User
} | null

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async (): Promise<SessionData> => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })
        
        if (!response.ok) {
          return null
        }
        
        const data = await response.json()
        return data.user ? data : null
      } catch (error) {
        return null
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}