import express from 'express'
import authController from '../controllers/auth.controller.js'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import validatorMiddleware from '../middlewares/validator.middleware.js'
import { schemaLogin, schemaRegister } from '../utils/shema.auth.js'


const authRouter = express.Router()

authRouter.post('/register', validatorMiddleware(schemaRegister), authController.register)
authRouter.post('/login', validatorMiddleware(schemaLogin), authController.login)
authRouter.get('/me', authenticateUser, authController.getMe)
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
// authRouter.post('/logout',authController)


export default authRouter