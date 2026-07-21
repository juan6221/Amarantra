import { useState, useEffect, useCallback } from 'react'
import { get, post, put, del } from '../../../lib/api'

export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await get('/api/categorias')
      setCategorias(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addCategoria = async (cat) => {
    const dup = categorias.some(c => c.nombre.toLowerCase() === cat.nombre.trim().toLowerCase())
    if (dup) return { error: { message: 'Ya existe una categoría con ese nombre.' } }

    try {
      const data = await post('/api/categorias', { ...cat, nombre: cat.nombre.trim() })
      setCategorias(prev => [...prev, data])
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const updateCategoria = async (id, updates) => {
    if (updates.nombre) {
      const dup = categorias.some(c => c.id !== id && c.nombre.toLowerCase() === updates.nombre.trim().toLowerCase())
      if (dup) return { error: { message: 'Ya existe una categoría con ese nombre.' } }
    }

    try {
      await put(`/api/categorias/${id}`, updates)
      setCategorias(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const deleteCategoria = async (id, hardDelete = false) => {
    try {
      if (hardDelete) {
        await del(`/api/categorias/${id}`)
        setCategorias(prev => prev.filter(c => c.id !== id))
      } else {
        await put(`/api/categorias/${id}`, { activo: false })
        setCategorias(prev => prev.map(c => c.id === id ? { ...c, activo: false } : c))
      }
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  return { categorias, loading, error, addCategoria, updateCategoria, deleteCategoria, refetch: fetchAll }
}


