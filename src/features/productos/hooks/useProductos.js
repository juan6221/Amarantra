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
    // Validar nombre duplicado
    const dup = productos.some(p => p.nombre.toLowerCase() === prod.nombre.trim().toLowerCase())
    if (dup) return { error: { message: 'Ya existe un producto con ese nombre.' } }

    const { categoriaId, createdAt, ...rest } = prod
    const { data, error } = await supabase
      .from('productos')
      .insert({ ...rest, nombre: prod.nombre.trim(), categoria_id: categoriaId || prod.categoriaId, created_at: new Date().toISOString().split('T')[0] })
      .select()
      .single()
    if (!error && data) {
      setProductos(prev => [...prev, { ...data, categoriaId: data.categoria_id, createdAt: data.created_at, imagenes: data.imagenes || [] }])
    }
    return { error }
  }

  const updateProducto = async (id, updates) => {
    // Validar nombre duplicado al editar
    if (updates.nombre) {
      const dup = productos.some(p => p.id !== id && p.nombre.toLowerCase() === updates.nombre.trim().toLowerCase())
      if (dup) return { error: { message: 'Ya existe un producto con ese nombre.' } }
    }
    const { categoriaId, createdAt, ...rest } = updates
    const payload = { ...rest }
    if (categoriaId !== undefined) payload.categoria_id = categoriaId
    const { error } = await supabase.from('productos').update(payload).eq('id', id)
    if (!error) setProductos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    return { error }
  }

  // hardDelete = true → eliminar permanentemente (solo si no tiene ventas)
  // hardDelete = false → desactivar (soft delete)
  const deleteProducto = async (id, hardDelete = false) => {
    if (hardDelete) {
      // Verificar si el producto ha sido vendido alguna vez
      const { data: vendido } = await supabase
        .from('venta_productos')
        .select('id')
        .eq('producto_id', id)
        .limit(1)
      if (vendido && vendido.length > 0)
        return { error: { message: 'No se puede eliminar: este producto ha sido vendido. Puedes desactivarlo.' } }

      const { error } = await supabase.from('productos').delete().eq('id', id)
      if (!error) setProductos(prev => prev.filter(p => p.id !== id))
      return { error }
    }
    const { error } = await supabase.from('productos').update({ activo: false }).eq('id', id)
    if (!error) setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: false } : p))
    return { error }
  }

  return { productos, loading, error, addProducto, updateProducto, deleteProducto, refetch: fetchAll }
}
