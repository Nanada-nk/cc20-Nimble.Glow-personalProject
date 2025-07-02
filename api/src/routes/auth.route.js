import express from 'express'
import authController from '../controllers/auth.controller.js'
import checkRole from '../middlewares/checkRole.middleware.js'

const authRouter = express.Router()

authRouter.post('/register',authController.register)
authRouter.post('/login',authController.login)
authRouter.post('/admin/register',checkRole("SUPERADMIN") ,authController.register)
// authRouter.get('/me',authController)
// authRouter.post('/logout',authController)


export default authRouter