import Venta from '../models/Venta.js'
import Cliente from '../models/Cliente.js'
import Producto from '../models/Producto.js'

export async function getVentas(req, res) {
  const where = req.user.rol === 'admin' ? {} : { usuarioId: req.user.id }
  const ventas = await Venta.findAll({ where })
  res.json(ventas)
}

export async function createVenta(req, res) {
  const { cliente, items, pago } = req.body
  if (cliente) {
    const clienteExiste = await Cliente.findByPk(cliente)
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
    const producto = await Producto.findByPk(item.producto)
    if (!producto) {
      return res.status(400).json({ message: `Producto no encontrado: ${item.producto}` })
    }

    const cantidad = Number(item.cantidad || 1)
    const precio = Number(item.precio ?? producto.precio)
    total += precio * cantidad

    ventaItems.push({
      producto: producto.id,
      cantidad,
      precio,
    })
  }

  const venta = await Venta.create({
    clienteId: cliente || null,
    usuarioId: req.user.id,
    items: ventaItems,
    total,
    pago: Number(pago ?? total),
  })

  res.status(201).json(venta)
}

export async function getVentaById(req, res) {
  const venta = await Venta.findByPk(req.params.id)
  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' })
  }

  res.json(venta)
}

export async function deleteVenta(req, res) {
  const { id } = req.params
  const venta = await Venta.findByPk(id)
  if (!venta) {
    return res.status(404).json({ message: 'Venta no encontrada' })
  }

  await venta.destroy()
  res.json({ message: 'Venta eliminada' })
}
