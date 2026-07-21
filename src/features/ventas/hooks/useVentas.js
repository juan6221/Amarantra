import { useState, useEffect, useCallback } from 'react'
import { get, post } from '../../../lib/api'

export function useVentas(usuarioId, rol) {
  const [ventas, setVentas]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    if (!usuarioId) return
    setLoading(true)

    try {
      const data = await get('/api/ventas')
      setVentas((data || []).map(v => ({
        ...v,
        usuarioId: v.usuario?._id || v.usuarioId,
        clienteId: v.cliente?._id || v.clienteId,
        productos: (v.items || []).map(i => ({
          productoId: i.producto?._id || i.producto,
          cantidad:   i.cantidad,
          precio:      i.precio,
        })),
        fecha: v.fecha || v.createdAt?.split('T')[0],
      })))
      setError(null)
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }, [usuarioId, rol])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addVenta = async ({ clienteId, productos, total, pago }) => {
    try {
      const body = {
        cliente: clienteId || null,
        items: productos.map(p => ({ producto: p.productoId, cantidad: p.cantidad, precio: p.precio })),
        pago: pago ?? total,
      }
      const venta = await post('/api/ventas', body)
      await fetchAll()
      return { error: null, venta }
    } catch (err) {
      return { error: err.message }
    }
  }

  return { ventas, loading, error, addVenta, refetch: fetchAll }
}


