import Producto from '../models/Producto.js'
import Categoria from '../models/Categoria.js'
import Venta from '../models/Venta.js'

export async function getProductos(req, res) {
  const productos = await Producto.find().populate('categoria', 'nombre descripcion')
  res.json(productos)
}

export async function createProducto(req, res) {
  const { nombre, descripcion, precio, stock, categoria, imagenes } = req.body
  const categoriaExists = await Categoria.findById(categoria)
  if (!categoriaExists) {
    return res.status(400).json({ message: 'Categoría inválida' })
  }

  const producto = await Producto.create({ nombre, descripcion, precio, stock, categoria, imagenes })
  res.status(201).json(producto)
}

export async function updateProducto(req, res) {
  const { id } = req.params
  const producto = await Producto.findById(id)
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  if (req.body.categoria) {
    const categoriaExists = await Categoria.findById(req.body.categoria)
    if (!categoriaExists) {
      return res.status(400).json({ message: 'Categoría inválida' })
    }
    producto.categoria = req.body.categoria
  }

  producto.nombre = req.body.nombre ?? producto.nombre
  producto.descripcion = req.body.descripcion ?? producto.descripcion
  producto.precio = req.body.precio ?? producto.precio
  producto.stock = req.body.stock ?? producto.stock
  producto.imagenes = req.body.imagenes ?? producto.imagenes

  await producto.save()
  res.json(producto)
}

export async function deleteProducto(req, res) {
  const { id } = req.params
  const producto = await Producto.findById(id)
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  const ventaExistente = await Venta.findOne({ 'items.producto': producto._id }).limit(1)
  if (ventaExistente) {
    return res.status(400).json({ message: 'No se puede eliminar: este producto ya fue vendido.' })
  }

  await producto.deleteOne()
  res.json({ message: 'Producto eliminado' })
}
