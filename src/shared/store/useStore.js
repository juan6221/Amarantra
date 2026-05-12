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
          // Intentar saber si el usuario existe pero está inactivo
          const { data: anyUser } = await supabase
            .from('usuarios').select('activo').eq('email', email).single()
          if (anyUser && !anyUser.activo)
            return { success: false, error: 'Tu cuenta está desactivada. Contacta al administrador.' }
          return { success: false, error: 'El correo o la contraseña son incorrectos. Verifica tus datos e intenta de nuevo.' }
        }

        set({ user: data, isAuthenticated: true })
        return { success: true, user: data }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'amaranta-auth-v3' }
  )
)
