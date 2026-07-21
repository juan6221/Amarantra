import Venta from '../models/Venta.js'
import Cliente from '../models/Cliente.js'
import Producto from '../models/Producto.js'

export async function getVentas(req, res) {
  const query = req.user.rol === 'admin' ? {} : { usuario: req.user._id }
  const ventas = await Venta.find(query)
    .populate('cliente', 'nombre documento email telefono direccion')
    .populate('usuario', 'nombre email rol')
    .populate('items.producto', 'nombre precio')
  res.json(ventas)
}

export async function createVenta(req, res) {
  const { cliente, items, pago } = req.body
  if (cliente) {
    const clienteExiste = await Cliente.findById(cliente)
    if (!clienteExiste) {
      return res.status(400).json({ message: 'Cliente inválido' })
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'La venta debe tener al menos un producto' })
  }

  let total = 0
  const ventaItems = []

  for (const item of items) {
    const producto = await Producto.findById(item.producto)
    if (!producto) {
      return res.status(400).json({ message: `Producto no encontrado: ${item.producto}` })
    }

    const cantidad = Number(item.cantidad || 1)
    const precio = Number(item.precio ?? producto.precio)
    total += precio * cantidad

    ventaItems.push({
      producto: producto._id,
      cantidad,
      precio,
    })
  }

  const venta = await Venta.create({
    cliente,
    usuario: req.user._id,
    items: ventaItems,
    total,
    pago: Number(pago ?? total),
  })

  res.status(201).json(venta)
}

export async function getVentaById(req, res) {
  const venta = await Venta.findById(req.params.id)
    .populate('cliente', 'nombre documento email telefono direccion')
    .populate('usuario', 'nombre email rol')
    .populate('items.producto', 'nombre precio')

  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' })
  }

  res.json(venta)
}

export async function deleteVenta(req, res) {
  const { id } = req.params
  const venta = await Venta.findById(id)
  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' })
  }

  await venta.deleteOne()
  res.json({ message: 'Venta eliminada' })
}
