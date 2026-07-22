import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

export async function register(req, res) {
  const { nombre, email, password, rol = 'user', telefono = '' } = req.body
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    return res.status(400).json({ message: 'El correo ya está registrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ nombre, email, password: hashedPassword, rol, telefono })

  res.status(201).json({
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
    },
    token: generateToken(user),
  })
}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas' })
  }
  if (user.activo === false) {
    return res.status(401).json({ message: 'Tu cuenta está desactivada. Contacta al administrador.' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciales incorrectas' })
  }

  res.json({
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
    },
    token: generateToken(user),
  })
}

export async function recoverPassword(req, res) {
  const { email } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }
  if (user.activo === false) {
    return res.status(400).json({ message: 'Esta cuenta está desactivada. Contacta al administrador.' })
  }

  // Aquí se puede integrar un servicio de correo o token de recuperación.
  res.json({ message: 'Solicitud de recuperación recibida. Revisa tu correo electrónico.' })
}

export async function resetPassword(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
  }
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  user.password = await bcrypt.hash(password, 10)
  await user.save()

  res.json({ message: 'Contraseña actualizada correctamente' })
}
