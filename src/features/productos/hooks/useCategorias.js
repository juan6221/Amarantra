import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('id')
    if (error) setError(error.message)
    else setCategorias(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addCategoria = async (cat) => {
    // Validar nombre duplicado
    const dup = categorias.some(c => c.nombre.toLowerCase() === cat.nombre.trim().toLowerCase())
    if (dup) return { error: { message: 'Ya existe una categoría con ese nombre.' } }

    const { data, error } = await supabase
      .from('categorias')
      .insert({ ...cat, nombre: cat.nombre.trim(), created_at: new Date().toISOString().split('T')[0] })
      .select()
      .single()
    if (!error && data) setCategorias(prev => [...prev, data])
    return { error }
  }

  const updateCategoria = async (id, updates) => {
    // Validar nombre duplicado al editar
    if (updates.nombre) {
      const dup = categorias.some(c => c.id !== id && c.nombre.toLowerCase() === updates.nombre.trim().toLowerCase())
      if (dup) return { error: { message: 'Ya existe una categoría con ese nombre.' } }
    }
    const { error } = await supabase.from('categorias').update(updates).eq('id', id)
    if (!error) setCategorias(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    return { error }
  }

  // softDelete = false → desactivar, hardDelete = true → eliminar permanentemente
  const deleteCategoria = async (id, hardDelete = false) => {
    if (hardDelete) {
      // Verificar si hay productos en esa categoría
      const { data: prods } = await supabase
        .from('productos')
        .select('id')
        .eq('categoria_id', id)
        .limit(1)
      if (prods && prods.length > 0)
        return { error: { message: 'No se puede eliminar: existen productos en esta categoría.' } }

      const { error } = await supabase.from('categorias').delete().eq('id', id)
      if (!error) setCategorias(prev => prev.filter(c => c.id !== id))
      return { error }
    }
    const { error } = await supabase.from('categorias').update({ activo: false }).eq('id', id)
    if (!error) setCategorias(prev => prev.map(c => c.id === id ? { ...c, activo: false } : c))
    return { error }
  }

  return { categorias, loading, error, addCategoria, updateCategoria, deleteCategoria, refetch: fetchAll }
}
