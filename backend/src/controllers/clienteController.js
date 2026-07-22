import Cliente from '../models/Cliente.js'
import Venta from '../models/Venta.js'

export async function getClientes(req, res) {
  const clientes = await Cliente.findAll()
  res.json(clientes)
}

export async function createCliente(req, res) {
  const { nombre, documento, email, telefono, direccion } = req.body
  const existing = await Cliente.findOne({ where: { documento } })
  if (existing) {
    return res.status(400).json({ message: 'El cliente ya está registrado' })
  }

  const cliente = await Cliente.create({ nombre, documento, email, telefono, direccion })
  res.status(201).json(cliente)
}

export async function updateCliente(req, res) {
  const { id } = req.params
  const cliente = await Cliente.findByPk(id)
  if (!cliente) {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }

  cliente.nombre = req.body.nombre ?? cliente.nombre
  cliente.documento = req.body.documento ?? cliente.documento
  cliente.email = req.body.email ?? cliente.email
  cliente.telefono = req.body.telefono ?? cliente.telefono
  cliente.direccion = req.body.direccion ?? cliente.direccion
  await cliente.save()

  res.json(cliente)
}

export async function deleteCliente(req, res) {
  const { id } = req.params
  const cliente = await Cliente.findByPk(id)
  if (!cliente) {
    return res.status(404).json({ message: 'Cliente no encontrado' })
  }

  const ventaExistente = await Venta.findOne({ where: { clienteId: cliente.id } })
  if (ventaExistente) {
    return res.status(400).json({ message: 'No se puede eliminar: el cliente tiene ventas registradas.' })
  }

  await cliente.destroy()
  res.json({ message: 'Cliente eliminado' })
}
