import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { requireAdmin } from '../middlewares/roleMiddleware.js'
import { getProductos, createProducto, updateProducto, deleteProducto } from '../controllers/productoController.js'

const router = express.Router()

router.use(protect)
router.get('/', getProductos)
router.post('/', requireAdmin, createProducto)
router.put('/:id', requireAdmin, updateProducto)
router.delete('/:id', requireAdmin, deleteProducto)

export default router
