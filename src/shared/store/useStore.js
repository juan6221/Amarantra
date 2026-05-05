import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USUARIOS, PRODUCTOS, CATEGORIAS, VENTAS_HISTORIAL } from '../data/mockData'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        const found = USUARIOS.find(u => u.email === email && u.password === password && u.activo)
        if (found) {
          const { password: _, ...safeUser } = found
          set({ user: safeUser, isAuthenticated: true })
          return { success: true, user: safeUser }
        }
        return { success: false, error: 'Credenciales incorrectas o usuario inactivo' }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'amaranta-auth' }
  )
)

export const useAppStore = create(
  persist(
    (set, get) => ({
      usuarios: USUARIOS,
      categorias: CATEGORIAS,
      productos: PRODUCTOS,
      ventas: VENTAS_HISTORIAL,

      // --- Usuarios ---
      addUsuario: (usuario) => set(s => ({
        usuarios: [...s.usuarios, { ...usuario, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateUsuario: (id, data) => set(s => ({
        usuarios: s.usuarios.map(u => u.id === id ? { ...u, ...data } : u)
      })),
      deleteUsuario: (id) => set(s => ({
        usuarios: s.usuarios.map(u => u.id === id ? { ...u, activo: false } : u)
      })),

      // --- Categorías ---
      addCategoria: (cat) => set(s => ({
        categorias: [...s.categorias, { ...cat, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateCategoria: (id, data) => set(s => ({
        categorias: s.categorias.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteCategoria: (id) => set(s => ({
        categorias: s.categorias.map(c => c.id === id ? { ...c, activo: false } : c)
      })),

      // --- Productos ---
      addProducto: (prod) => set(s => ({
        productos: [...s.productos, { ...prod, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
      })),
      updateProducto: (id, data) => set(s => ({
        productos: s.productos.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteProducto: (id) => set(s => ({
        productos: s.productos.map(p => p.id === id ? { ...p, activo: false } : p)
      })),

      // --- Ventas ---
      addVenta: (venta) => set(s => {
        const nuevaVenta = {
          ...venta,
          id: Date.now(),
          fecha: new Date().toISOString().split('T')[0],
          estado: 'completada',
        }
        // Descontar stock
        const productosActualizados = s.productos.map(p => {
          const item = venta.productos.find(v => v.productoId === p.id)
          if (item) return { ...p, stock: Math.max(0, p.stock - item.cantidad) }
          return p
        })
        return { ventas: [...s.ventas, nuevaVenta], productos: productosActualizados }
      }),
    }),
    { name: 'amaranta-data-v2' }
  )
)
