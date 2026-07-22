import { useState, useEffect, useCallback } from 'react'
import { get, post, put, del } from '../../../lib/api'

export function useProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await get('/api/productos')
      setProductos((data || []).map(p => ({
        ...p,
        categoriaId: p.categoria?._id || p.categoriaId,
        createdAt:   p.createdAt || p.created_at,
        imagenes:    p.imagenes || [],
      })))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addProducto = async (prod) => {
    const dup = productos.some(p => p.nombre.toLowerCase() === prod.nombre.trim().toLowerCase())
    if (dup) return { error: { message: 'Ya existe un producto con ese nombre.' } }

    try {
      const payload = {
        ...prod,
        nombre: prod.nombre.trim(),
        categoriaId: prod.categoriaId,
      }
      const data = await post('/api/productos', payload)
      setProductos(prev => [...prev, {
        ...data,
        categoriaId: data.categoria?._id || data.categoriaId,
        createdAt: data.createdAt,
        imagenes: data.imagenes || [],
      }])
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const updateProducto = async (id, updates) => {
    if (updates.nombre) {
      const dup = productos.some(p => p.id !== id && p.nombre.toLowerCase() === updates.nombre.trim().toLowerCase())
      if (dup) return { error: { message: 'Ya existe un producto con ese nombre.' } }
    }

    const payload = { ...updates }
    try {
      await put(`/api/productos/${id}`, payload)
      setProductos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const deleteProducto = async (id, hardDelete = false) => {
    try {
      if (hardDelete) {
        await del(`/api/productos/${id}`)
        setProductos(prev => prev.filter(p => p.id !== id))
      } else {
        await put(`/api/productos/${id}`, { activo: false })
        setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: false } : p))
      }
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  return { productos, loading, error, addProducto, updateProducto, deleteProducto, refetch: fetchAll }
}