import express from 'express'
import usersController from '../controllers/users.controller.js'
import checkRole from '../middlewares/checkRole.middleware.js'

const usersRouter = express.Router()

usersRouter.get('/', checkRole("SUPERADMIN","ADMIN"),usersController.getListAllUser)
usersRouter.get('/:id',checkRole("SUPERADMIN","ADMIN"),usersController.getUserById)
usersRouter.patch('/:id',checkRole("SUPERADMIN"),usersController.updateRole)
usersRouter.patch('/edit/:id',checkRole("CUSTOMER"),usersController.updateUser)
usersRouter.delete('/:id',checkRole("SUPERADMIN"),usersController.deleteCustomer)



export default usersRouter