import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export function useProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id')
    if (error) setError(error.message)
    else {
      // Normalizar: categoria_id → categoriaId, created_at → createdAt
      setProductos((data || []).map(p => ({
        ...p,
        categoriaId: p.categoria_id,
        createdAt:   p.created_at,
        imagenes:    p.imagenes || [],
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addProducto = async (prod) => {
    const { categoriaId, createdAt, ...rest } = prod
    const { data, error } = await supabase
      .from('productos')
      .insert({ ...rest, categoria_id: categoriaId || prod.categoriaId, created_at: new Date().toISOString().split('T')[0] })
      .select()
      .single()
    if (!error && data) {
      setProductos(prev => [...prev, { ...data, categoriaId: data.categoria_id, createdAt: data.created_at, imagenes: data.imagenes || [] }])
    }
    return { error }
  }

  const updateProducto = async (id, updates) => {
    const { categoriaId, createdAt, ...rest } = updates
    const payload = { ...rest }
    if (categoriaId !== undefined) payload.categoria_id = categoriaId
    const { error } = await supabase.from('productos').update(payload).eq('id', id)
    if (!error) setProductos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    return { error }
  }

  const deleteProducto = async (id) => {
    const { error } = await supabase.from('productos').update({ activo: false }).eq('id', id)
    if (!error) setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: false } : p))
    return { error }
  }

  return { productos, loading, error, addProducto, updateProducto, deleteProducto, refetch: fetchAll }
}
