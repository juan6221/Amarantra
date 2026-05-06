import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, activo, created_at')
      .order('id')
    if (error) setError(error.message)
    else setUsuarios(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addUsuario = async (usuario) => {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({ ...usuario, created_at: new Date().toISOString().split('T')[0] })
      .select('id, nombre, email, rol, activo, created_at')
      .single()
    if (!error && data) setUsuarios(prev => [...prev, data])
    return { error }
  }

  const updateUsuario = async (id, updates) => {
    const { error } = await supabase.from('usuarios').update(updates).eq('id', id)
    if (!error) setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
    return { error }
  }

  const deleteUsuario = async (id) => {
    const { error } = await supabase.from('usuarios').update({ activo: false }).eq('id', id)
    if (!error) setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: false } : u))
    return { error }
  }

  return { usuarios, loading, error, addUsuario, updateUsuario, deleteUsuario, refetch: fetchAll }
}
