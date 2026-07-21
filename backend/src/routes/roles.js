import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { requireAdmin } from '../middlewares/roleMiddleware.js'
import { getRoles, createRole, updateRole, deleteRole } from '../controllers/roleController.js'

const router = express.Router()

router.use(protect, requireAdmin)
router.get('/', getRoles)
router.post('/', createRole)
router.put('/:id', updateRole)
router.delete('/:id', deleteRole)

export default router
