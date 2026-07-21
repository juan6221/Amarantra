import mongoose from 'mongoose'

const ventaItemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true, default: 1 },
  precio: { type: Number, required: true, default: 0 },
})

const ventaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [ventaItemSchema], required: true },
  total: { type: Number, required: true, default: 0 },
  pago: { type: Number, required: true, default: 0 },
  estado: { type: String, default: 'completada' },
  fecha: { type: String, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: Date, default: Date.now },
})

const Venta = mongoose.model('Venta', ventaSchema)
export default Venta
