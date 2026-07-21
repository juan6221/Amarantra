import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, default: '', trim: true },
  precio: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  imagenes: { type: [String], default: [] },
  activo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

const Producto = mongoose.model('Producto', productoSchema)
export default Producto
