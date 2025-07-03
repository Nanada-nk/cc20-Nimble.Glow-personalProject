import express from 'express'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import checkRole from '../middlewares/checkRole.middleware.js'
import cartController from '../controllers/cart.controller.js' // <-- import controller

const cartRouter = express.Router()

cartRouter.get('/', authenticateUser, checkRole("CUSTOMER"), cartController.getCart);
cartRouter.post('/', authenticateUser, checkRole("CUSTOMER"), cartController.addItemToCart);
cartRouter.delete('/items/:itemId', authenticateUser, checkRole("CUSTOMER"), cartController.removeItem);

export default cartRouter