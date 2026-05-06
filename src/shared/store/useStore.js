import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, nombre, email, rol, activo')
          .eq('email', email)
          .eq('password', password)
          .eq('activo', true)
          .single()

        console.log('[login] data:', data, '| error:', error)

        if (error || !data) {
          const msg = error?.message || 'Credenciales incorrectas o usuario inactivo'
          return { success: false, error: msg }
        }

        set({ user: data, isAuthenticated: true })
        return { success: true, user: data }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'amaranta-auth-v3' }
  )
)
