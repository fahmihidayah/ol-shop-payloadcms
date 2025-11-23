import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Customer } from '@/payload-types'

export interface UserState {
  // User data
  user: Customer | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: Customer | null, token?: string) => void
  login: (user: Customer, token: string) => void
  logout: () => void
  updateUser: (user: Partial<Customer>) => void
  fetchUser: () => Promise<void>

  // Internal helpers
  _setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user (can be used to update user data)
      setUser: (user, token) => {
        set({
          user,
          token: token || get().token,
          isAuthenticated: !!user,
        })
      },

      // Login - set user and token
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      // Logout - clear user data
      logout: async () => {
        try {
          // Call logout API
          await fetch('/api/customers/logout', {
            method: 'POST',
            credentials: 'include',
          })
        } catch (error) {
          console.error('Logout API call failed:', error)
        } finally {
          // Clear user state regardless of API call result
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      // Update user (partial update)
      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      // Fetch user from server
      fetchUser: async () => {
        set({ isLoading: true })

        try {
          const response = await fetch('/api/customers/me', {
            credentials: 'include',
          })

          if (!response.ok) {
            // Not logged in or error
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            })
            return
          }

          const data = await response.json()

          if (data.user) {
            set({
              user: data.user,
              token: data.token || null,
              isAuthenticated: true,
            })
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      // Internal helpers
      _setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// Selectors for better performance
export const useUser = () => useUserStore((state) => state.user)
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated)
export const useUserIsLoading = () => useUserStore((state) => state.isLoading)
