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
    const { data, error } = await supabase
      .from('categorias')
      .insert({ ...cat, created_at: new Date().toISOString().split('T')[0] })
      .select()
      .single()
    if (!error && data) setCategorias(prev => [...prev, data])
    return { error }
  }

  const updateCategoria = async (id, updates) => {
    const { error } = await supabase.from('categorias').update(updates).eq('id', id)
    if (!error) setCategorias(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    return { error }
  }

  const deleteCategoria = async (id) => {
    const { error } = await supabase.from('categorias').update({ activo: false }).eq('id', id)
    if (!error) setCategorias(prev => prev.map(c => c.id === id ? { ...c, activo: false } : c))
    return { error }
  }

  return { categorias, loading, error, addCategoria, updateCategoria, deleteCategoria, refetch: fetchAll }
}
