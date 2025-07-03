import express from 'express'
import authController from '../controllers/auth.controller.js'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import validatorMiddleware from '../middlewares/validator.middleware.js'
import { schemaLogin, schemaRegister } from '../utils/shema.auth.js'
import upload from '../middlewares/upload.middleware.js'

const authRouter = express.Router()

authRouter.post('/register',validatorMiddleware(schemaRegister),upload.single('profileImage') ,authController.register)
authRouter.post('/login',validatorMiddleware(schemaLogin),authController.login)
authRouter.get('/me',authenticateUser,authController.getMe)
// authRouter.post('/logout',authController)


export default authRouter