import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { requireAdmin } from '../middlewares/roleMiddleware.js'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../controllers/categoriaController.js'

const router = express.Router()

router.use(protect)
router.get('/', getCategorias)
router.post('/', requireAdmin, createCategoria)
router.put('/:id', requireAdmin, updateCategoria)
router.delete('/:id', requireAdmin, deleteCategoria)

export default router
