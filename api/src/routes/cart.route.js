import express from 'express'
import checkRole from '../middlewares/checkRole.middleware.js'
import cartController from '../controllers/cart.controller.js'

const cartRouter = express.Router()

cartRouter.get('/', cartController.getCart)
cartRouter.post('/', checkRole("CUSTOMER"), cartController.addItemToCart)
cartRouter.delete('/items/:itemId', checkRole("CUSTOMER"), cartController.removeItem)

export default cartRouter