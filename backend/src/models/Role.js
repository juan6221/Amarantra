import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    default: '',
  },
})

const Role = mongoose.model('Role', roleSchema)
export default Role
