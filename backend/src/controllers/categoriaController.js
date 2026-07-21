import Categoria from '../models/Categoria.js'
import Producto from '../models/Producto.js'

export async function getCategorias(req, res) {
  const categorias = await Categoria.find()
  res.json(categorias)
}

export async function createCategoria(req, res) {
  const { nombre, descripcion } = req.body
  const existing = await Categoria.findOne({ nombre })
  if (existing) {
    return res.status(400).json({ message: 'La categoría ya existe' })
  }

  const categoria = await Categoria.create({ nombre, descripcion })
  res.status(201).json(categoria)
}

export async function updateCategoria(req, res) {
  const { id } = req.params
  const categoria = await Categoria.findById(id)
  if (!categoria) {
    return res.status(404).json({ message: 'Categoría no encontrada' })
  }

  categoria.nombre = req.body.nombre ?? categoria.nombre
  categoria.descripcion = req.body.descripcion ?? categoria.descripcion
  await categoria.save()

  res.json(categoria)
}

export async function deleteCategoria(req, res) {
  const { id } = req.params
  const categoria = await Categoria.findById(id)
  if (!categoria) {
    return res.status(404).json({ message: 'Categoría no encontrada' })
  }

  const producto = await Producto.findOne({ categoria: categoria._id })
  if (producto) {
    return res.status(400).json({ message: 'No se puede eliminar: existen productos en esta categoría.' })
  }

  await categoria.deleteOne()
  res.json({ message: 'Categoría eliminada' })
}
