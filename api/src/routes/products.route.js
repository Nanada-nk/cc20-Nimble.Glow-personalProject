import express from 'express'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import productController from '../controllers/product.controller.js'


const productsRouter = express.Router()

productsRouter.get('/', productController.getAll)
productsRouter.get('/:id', productController.getById)
productsRouter.post('/', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), productController.create)
productsRouter.post('/:productId/images', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), productController.addImages);
productsRouter.patch('/:id', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), productController.updateProduct)
productsRouter.delete('/:id', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), productController.deleteProduct)


export default productsRouter