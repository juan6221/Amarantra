import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { requireAdmin } from '../middlewares/roleMiddleware.js'
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js'

const router = express.Router()

router.use(protect, requireAdmin)
router.get('/', getUsuarios)
router.post('/', createUsuario)
router.put('/:id', updateUsuario)
router.delete('/:id', deleteUsuario)

export default router
