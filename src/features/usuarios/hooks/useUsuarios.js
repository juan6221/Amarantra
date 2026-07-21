import { useState, useEffect, useCallback } from 'react'
import { get, post, put, del } from '../../../lib/api'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await get('/api/usuarios')
      setUsuarios(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addUsuario = async (usuario) => {
    if (usuarios.some(u => u.email.toLowerCase() === usuario.email.toLowerCase())) {
      return { error: { message: 'Ya existe un usuario con ese correo electrónico.' } }
    }

    try {
      const data = await post('/api/usuarios', usuario)
      setUsuarios(prev => [...prev, data])
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const updateUsuario = async (id, updates) => {
    try {
      await put(`/api/usuarios/${id}`, updates)
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const deleteUsuario = async (id, hardDelete = false) => {
    try {
      if (hardDelete) {
        await del(`/api/usuarios/${id}`)
        setUsuarios(prev => prev.filter(u => u.id !== id))
      } else {
        await put(`/api/usuarios/${id}`, { activo: false })
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: false } : u))
      }
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  return { usuarios, loading, error, addUsuario, updateUsuario, deleteUsuario, refetch: fetchAll }
}


