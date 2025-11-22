'use client'

import { useQuery } from '@tanstack/react-query'
import { SessionData } from '@/types/session-data'

export function useSession() {
  return useQuery<SessionData | null>({
    queryKey: ['customer-session'],
    queryFn: async (): Promise<SessionData | null> => {
      try {
        const response = await fetch('/api/customers/me', {
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
