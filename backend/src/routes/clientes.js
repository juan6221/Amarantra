import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { requireAdmin } from '../middlewares/roleMiddleware.js'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../controllers/clienteController.js'

const router = express.Router()

router.use(protect)
router.get('/', getClientes)
router.post('/', requireAdmin, createCliente)
router.put('/:id', requireAdmin, updateCliente)
router.delete('/:id', requireAdmin, deleteCliente)

export default router
