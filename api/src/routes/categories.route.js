import express from 'express'
import authenticateUser from '../middlewares/authenticate.middleware.js'
import checkRole from '../middlewares/checkRole.middleware.js'
import categoryController from '../controllers/category.controller.js'


const categoriesRouter = express.Router()

categoriesRouter.get('/', categoryController.getAll)
categoriesRouter.post('/', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), categoryController.create)
categoriesRouter.patch('/:id', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), categoryController.updateCategory)
categoriesRouter.delete('/:id', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), categoryController.deleteCategory)


export default categoriesRouter