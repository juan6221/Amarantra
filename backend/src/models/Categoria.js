import mongoose from 'mongoose'

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  descripcion: { type: String, default: '', trim: true },
  activo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

const Categoria = mongoose.model('Categoria', categoriaSchema)
export default Categoria
