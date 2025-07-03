import express from 'express'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import checkRole from '../middlewares/checkRole.middleware.js'


const ordersRouter = express.Router()

ordersRouter.get('/',authenticateUser,checkRole("CUSTOMER"), () => { })
ordersRouter.get('/:id',authenticateUser,checkRole("CUSTOMER"), () => { })
ordersRouter.post('/',authenticateUser,checkRole("CUSTOMER"), () => { })
ordersRouter.patch('/:id/status',authenticateUser,checkRole("SUPERADMIN","ADMIN") , () => { })

export default ordersRouter