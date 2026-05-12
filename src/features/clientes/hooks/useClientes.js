import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('clientes').select('*').order('id')
    if (error) setError(error.message)
    else setClientes(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addCliente = async (cliente) => {
    const exists = clientes.some(c => c.email && c.email.toLowerCase() === cliente.email?.toLowerCase())
    if (exists) return { error: { message: 'Ya existe un cliente con ese correo' } }
    const { data, error } = await supabase.from('clientes').insert({ ...cliente, created_at: new Date().toISOString().split('T')[0] }).select().single()
    if (!error && data) setClientes(prev => [...prev, data])
    return { error }
  }

  const updateCliente = async (id, updates) => {
    const exists = clientes.some(c => c.email && c.email.toLowerCase() === updates.email?.toLowerCase() && c.id !== id)
    if (exists) return { error: { message: 'Ya existe un cliente con ese correo' } }
    const { error } = await supabase.from('clientes').update(updates).eq('id', id)
    if (!error) setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    return { error }
  }

  const deleteCliente = async (id) => {
    // Verificar si tiene ventas
    const { count } = await supabase.from('ventas').select('id', { count: 'exact', head: true }).eq('cliente_id', id)
    if (count > 0) return { error: { message: `Este cliente tiene ${count} venta(s) registrada(s) y no puede eliminarse` } }
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (!error) setClientes(prev => prev.filter(c => c.id !== id))
    return { error }
  }

  const toggleActivo = async (id, activo) => {
    const { error } = await supabase.from('clientes').update({ activo }).eq('id', id)
    if (!error) setClientes(prev => prev.map(c => c.id === id ? { ...c, activo } : c))
    return { error }
  }

  return { clientes, loading, error, addCliente, updateCliente, deleteCliente, toggleActivo, refetch: fetchAll }
}
