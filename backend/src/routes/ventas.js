import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { getVentas, createVenta, getVentaById, deleteVenta } from '../controllers/ventaController.js'

const router = express.Router()

router.use(protect)
router.get('/', getVentas)
router.post('/', createVenta)
router.get('/:id', getVentaById)
router.delete('/:id', deleteVenta)

export default router
