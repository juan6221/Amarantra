import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import usuarioRoutes from './routes/usuarios.js'
import roleRoutes from './routes/roles.js'
import clienteRoutes from './routes/clientes.js'
import categoriaRoutes from './routes/categorias.js'
import productoRoutes from './routes/productos.js'
import ventaRoutes from './routes/ventas.js'
import perfilRoutes from './routes/perfil.js'
import { errorHandler } from './middlewares/errorMiddleware.js'

dotenv.config()
const app = express()
connectDB()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ message: 'Amaranta backend is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/ventas', ventaRoutes)
app.use('/api/perfil', perfilRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
