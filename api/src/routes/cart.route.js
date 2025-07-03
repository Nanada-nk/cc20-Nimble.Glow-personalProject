import express from 'express'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import checkRole from '../middlewares/checkRole.middleware.js'


const cartRouter = express.Router()

cartRouter.get('/',authenticateUser,checkRole("CUSTOMER"), () => { })
cartRouter.post('/',authenticateUser,checkRole("CUSTOMER"), () => { })
cartRouter.delete('/items/:itemId',authenticateUser,checkRole("CUSTOMER"), () => { })


export default cartRouter