import express from 'express'
import authController from '../controllers/auth.controller.js'
import authenticateUser from '../middlewares/authenticate.middleware.js'

const authRouter = express.Router()

authRouter.post('/register',authController.register)
authRouter.post('/login',authController.login)
authRouter.get('/me',authenticateUser,authController.getMe)
// authRouter.post('/logout',authController)


export default authRouter