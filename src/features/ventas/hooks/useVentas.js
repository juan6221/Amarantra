import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'

export function useVentas(usuarioId, rol) {
  const [ventas, setVentas]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    if (!usuarioId) return
    setLoading(true)

    let query = supabase
      .from('ventas')
      .select('*, venta_items(producto_id, cantidad, precio)')
      .order('id', { ascending: false })

    if (rol !== 'admin') query = query.eq('usuario_id', usuarioId)

    const { data, error } = await query
    if (error) setError(error.message)
    else {
      setVentas((data || []).map(v => ({
        ...v,
        usuarioId: v.usuario_id,
        productos: (v.venta_items || []).map(i => ({
          productoId: i.producto_id,
          cantidad:   i.cantidad,
          precio:     i.precio,
        })),
      })))
    }
    setLoading(false)
  }, [usuarioId, rol])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addVenta = async ({ usuarioId: uid, productos, total }) => {
    // 1. Insertar venta
    const { data: venta, error: ventaError } = await supabase
      .from('ventas')
      .insert({ usuario_id: uid, total, estado: 'completada', fecha: new Date().toISOString().split('T')[0] })
      .select()
      .single()

    if (ventaError) return { error: ventaError }

    // 2. Insertar items
    const items = productos.map(p => ({
      venta_id:    venta.id,
      producto_id: p.productoId,
      cantidad:    p.cantidad,
      precio:      p.precio,
    }))
    await supabase.from('venta_items').insert(items)

    // 3. Descontar stock
    for (const p of productos) {
      const { data: prod } = await supabase.from('productos').select('stock').eq('id', p.productoId).single()
      if (prod) {
        await supabase.from('productos').update({ stock: Math.max(0, prod.stock - p.cantidad) }).eq('id', p.productoId)
      }
    }

    await fetchAll()
    return { error: null, venta }
  }

  return { ventas, loading, error, addVenta, refetch: fetchAll }
}
