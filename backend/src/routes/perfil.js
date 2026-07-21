import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { getPerfil, updatePerfil } from '../controllers/perfilController.js'

const router = express.Router()

router.use(protect)
router.get('/', getPerfil)
router.put('/', updatePerfil)

export default router
