import Producto from '../models/Producto.js'
import Categoria from '../models/Categoria.js'
import Venta from '../models/Venta.js'

export async function getProductos(req, res) {
  const productos = await Producto.findAll()
  res.json(productos)
}

export async function createProducto(req, res) {
  const { nombre, descripcion, precio, stock, categoriaId, imagenes } = req.body
  const categoriaExists = await Categoria.findByPk(categoriaId)
  if (!categoriaExists) {
    return res.status(400).json({ message: 'Categoría inválida' })
  }

  const producto = await Producto.create({ nombre, descripcion, precio, stock, categoriaId, imagenes })
  res.status(201).json(producto)
}

export async function updateProducto(req, res) {
  const { id } = req.params
  const producto = await Producto.findByPk(id)
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  if (req.body.categoriaId) {
    const categoriaExists = await Categoria.findByPk(req.body.categoriaId)
    if (!categoriaExists) {
      return res.status(400).json({ message: 'Categoría inválida' })
    }
    producto.categoriaId = req.body.categoriaId
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
  const producto = await Producto.findByPk(id)
  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  const ventas = await Venta.findAll()
  const ventaExistente = ventas.some(venta =>
    Array.isArray(venta.items) && venta.items.some(item => item.producto === id || item.producto === Number(id))
  )

  if (ventaExistente) {
    return res.status(400).json({ message: 'No se puede eliminar: este producto ya fue vendido.' })
  }

  await producto.destroy()
  res.json({ message: 'Producto eliminado' })
}
