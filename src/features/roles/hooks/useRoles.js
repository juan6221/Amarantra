import { useState, useEffect, useCallback } from 'react'
import { get, post, put, del } from '../../../lib/api'

export function useRoles() {
  const [roles, setRoles]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await get('/api/roles')
      setRoles(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addRol = async (rol) => {
    if (roles.some(r => r.nombre.toLowerCase() === rol.nombre.toLowerCase())) {
      return { error: { message: 'Ya existe un rol con ese nombre' } }
    }
    try {
      const data = await post('/api/roles', rol)
      setRoles(prev => [...prev, data])
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const updateRol = async (id, updates) => {
    if (updates.nombre && roles.some(r => r.nombre.toLowerCase() === updates.nombre.trim().toLowerCase() && r.id !== id)) {
      return { error: { message: 'Ya existe un rol con ese nombre' } }
    }
    try {
      await put(`/api/roles/${id}`, updates)
      setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const deleteRol = async (id) => {
    const rol = roles.find(r => r.id === id)
    if (!rol) return { error: { message: 'Rol no encontrado' } }

    try {
      const usuarios = await get('/api/usuarios')
      const count = (usuarios || []).filter(u => u.rol === rol.nombre).length
      if (count > 0) return { error: { message: `No se puede eliminar: ${count} usuario(s) tienen este rol` } }
      await del(`/api/roles/${id}`)
      setRoles(prev => prev.filter(r => r.id !== id))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  return { roles, loading, error, addRol, updateRol, deleteRol, refetch: fetchAll }
}


