import express from 'express'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import productController from '../controllers/product.controller.js'
import checkRole from '../middlewares/checkRole.middleware.js'
import upload from '../middlewares/upload.middleware.js'


const productsRouter = express.Router()

productsRouter.get('/', productController.getAll)
productsRouter.get('/:id', productController.getById)
productsRouter.post('/', authenticateUser, checkRole("SUPERADMIN", "ADMIN"),upload.array('images', 10), productController.create)
productsRouter.patch('/:id', authenticateUser, checkRole("SUPERADMIN", "ADMIN"),upload.array('images', 10), productController.updateProduct)
productsRouter.delete('/:id', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), productController.deleteProduct)


export default productsRouter