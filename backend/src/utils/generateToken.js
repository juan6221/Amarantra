import jwt from 'jsonwebtoken'

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      rol: user.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  )
}
