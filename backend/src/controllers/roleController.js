import Role from '../models/Role.js'

export async function getRoles(req, res) {
  const roles = await Role.findAll()
  res.json(roles)
}

export async function createRole(req, res) {
  const { nombre, descripcion } = req.body
  const existing = await Role.findOne({ where: { nombre } })
  if (existing) {
    return res.status(400).json({ message: 'El rol ya existe' })
  }

  const role = await Role.create({ nombre, descripcion })
  res.status(201).json(role)
}

export async function updateRole(req, res) {
  const { id } = req.params
  const role = await Role.findByPk(id)
  if (!role) {
    return res.status(404).json({ message: 'Rol no encontrado' })
  }

  role.nombre = req.body.nombre ?? role.nombre
  role.descripcion = req.body.descripcion ?? role.descripcion
  await role.save()

  res.json(role)
}

export async function deleteRole(req, res) {
  const { id } = req.params
  const role = await Role.findByPk(id)
  if (!role) {
    return res.status(404).json({ message: 'Rol no encontrado' })
  }

  await role.destroy()
  res.json({ message: 'Rol eliminado' })
}
