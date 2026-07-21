import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export async function getPerfil(req, res) {
  const user = await User.findById(req.user._id).select('-password')
  if (!user) {
    return res.status(404).json({ message: 'Perfil no encontrado' })
  }
  res.json(user)
}

export async function updatePerfil(req, res) {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ message: 'Perfil no encontrado' })
  }

  if (req.body.email && req.body.email !== user.email) {
    const exists = await User.findOne({ email: req.body.email })
    if (exists) {
      return res.status(400).json({ message: 'El correo ya está en uso por otro usuario.' })
    }
  }

  user.nombre = req.body.nombre ?? user.nombre
  user.email = req.body.email ?? user.email
  user.telefono = req.body.telefono ?? user.telefono

  if (req.body.currentPassword && req.body.password) {
    const match = await bcrypt.compare(req.body.currentPassword, user.password)
    if (!match) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta.' })
    }
    user.password = await bcrypt.hash(req.body.password, 10)
  } else if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10)
  }

  const updated = await user.save()
  res.json({
    id: updated._id,
    nombre: updated.nombre,
    email: updated.email,
    rol: updated.rol,
    telefono: updated.telefono,
  })
}
