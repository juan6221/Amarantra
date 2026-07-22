import { useState, useEffect, useCallback } from 'react'
import { get, post, put, del } from '../../../lib/api'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await get('/api/clientes')
      setClientes(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addCliente = async (cliente) => {
    if (clientes.some(c => c.email && c.email.toLowerCase() === cliente.email?.toLowerCase())) {
      return { error: { message: 'Ya existe un cliente con ese correo' } }
    }
    try {
      const data = await post('/api/clientes', cliente)
      setClientes(prev => [...prev, data])
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const updateCliente = async (id, updates) => {
    if (updates.email && clientes.some(c => c.email && c.email.toLowerCase() === updates.email?.toLowerCase() && c.id !== id)) {
      return { error: { message: 'Ya existe un cliente con ese correo' } }
    }
    try {
      await put(`/api/clientes/${id}`, updates)
      setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const deleteCliente = async (id) => {
    try {
      await del(`/api/clientes/${id}`)
      setClientes(prev => prev.filter(c => c.id !== id))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  const toggleActivo = async (id, activo) => {
    try {
      await put(`/api/clientes/${id}`, { activo })
      setClientes(prev => prev.map(c => c.id === id ? { ...c, activo } : c))
      return { error: null }
    } catch (err) {
      return { error: { message: err.message } }
    }
  }

  return { clientes, loading, error, addCliente, updateCliente, deleteCliente, toggleActivo, refetch: fetchAll }
}