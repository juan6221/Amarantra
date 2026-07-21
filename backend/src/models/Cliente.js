import mongoose from 'mongoose'

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  documento: { type: String, required: true, unique: true, trim: true },
  email: { type: String, default: '', trim: true },
  telefono: { type: String, default: '', trim: true },
  direccion: { type: String, default: '', trim: true },
  activo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

const Cliente = mongoose.model('Cliente', clienteSchema)
export default Cliente
