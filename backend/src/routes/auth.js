import express from 'express'
import { login, register, recoverPassword, resetPassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/recover-password', recoverPassword)
router.put('/recover-password', resetPassword)

export default router
