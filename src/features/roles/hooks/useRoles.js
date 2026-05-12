import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export function useRoles() {
  const [roles, setRoles]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('roles').select('*').order('id')
    if (error) setError(error.message)
    else setRoles(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addRol = async (rol) => {
    // Validar duplicado
    const exists = roles.some(r => r.nombre.toLowerCase() === rol.nombre.toLowerCase())
    if (exists) return { error: { message: 'Ya existe un rol con ese nombre' } }
    const { data, error } = await supabase.from('roles').insert({ ...rol, created_at: new Date().toISOString().split('T')[0] }).select().single()
    if (!error && data) setRoles(prev => [...prev, data])
    return { error }
  }

  const updateRol = async (id, updates) => {
    const exists = roles.some(r => r.nombre.toLowerCase() === updates.nombre?.toLowerCase() && r.id !== id)
    if (exists) return { error: { message: 'Ya existe un rol con ese nombre' } }
    const { error } = await supabase.from('roles').update(updates).eq('id', id)
    if (!error) setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
    return { error }
  }

  const deleteRol = async (id) => {
    // Verificar si hay usuarios con este rol
    const rol = roles.find(r => r.id === id)
    if (!rol) return { error: { message: 'Rol no encontrado' } }
    const { count } = await supabase.from('usuarios').select('id', { count: 'exact', head: true }).eq('rol', rol.nombre)
    if (count > 0) return { error: { message: `No se puede eliminar: ${count} usuario(s) tienen este rol` } }
    const { error } = await supabase.from('roles').delete().eq('id', id)
    if (!error) setRoles(prev => prev.filter(r => r.id !== id))
    return { error }
  }

  return { roles, loading, error, addRol, updateRol, deleteRol, refetch: fetchAll }
}
