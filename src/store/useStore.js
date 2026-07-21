import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { post, setAuthToken, clearAuthToken } from '../lib/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { user, token } = await post('/api/auth/login', { email, password })
          setAuthToken(token)
          set({ user, token, isAuthenticated: true })
          return { success: true, user }
        } catch (error) {
          const message = error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
          return { success: false, error: message }
        }
      },

      logout: () => {
        clearAuthToken()
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'amaranta-auth-v3' }
  )
)

useAuthStore.subscribe(
  (state) => {
    if (state.token) {
      setAuthToken(state.token)
    } else {
      clearAuthToken()
    }
  },
  (state) => state.token
)


