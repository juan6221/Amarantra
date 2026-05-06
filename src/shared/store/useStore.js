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

        if (error || !data) {
          return { success: false, error: 'Credenciales incorrectas o usuario inactivo' }
        }

        set({ user: data, isAuthenticated: true })
        return { success: true, user: data }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'amaranta-auth-v3' }
  )
)
