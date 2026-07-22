import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export async function getUsuarios(req, res) {
  const usuarios = await User.findAll({
    attributes: { exclude: ['password'] }
  })
  res.json(usuarios)
}

export async function createUsuario(req, res) {
  const { nombre, email, password, rol, telefono } = req.body
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    return res.status(400).json({ message: 'El correo ya está registrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ nombre, email, password: hashedPassword, rol, telefono })
  res.status(201).json({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    telefono: user.telefono,
  })
}

export async function updateUsuario(req, res) {
  const { id } = req.params
  const { nombre, email, rol, telefono, password } = req.body
  const usuario = await User.findByPk(id)
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  usuario.nombre = nombre ?? usuario.nombre
  usuario.email = email ?? usuario.email
  usuario.rol = rol ?? usuario.rol
  usuario.telefono = telefono ?? usuario.telefono
  if (password) {
    usuario.password = await bcrypt.hash(password, 10)
  }

  const updated = await usuario.save()
  res.json({
    id: updated.id,
    nombre: updated.nombre,
    email: updated.email,
    rol: updated.rol,
    telefono: updated.telefono,
  })
}

export async function deleteUsuario(req, res) {
  const { id } = req.params
  const usuario = await User.findByPk(id)
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  await usuario.destroy()
  res.json({ message: 'Usuario eliminado' })
}
