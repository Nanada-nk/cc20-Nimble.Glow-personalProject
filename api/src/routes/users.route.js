import express from 'express'
import usersController from '../controllers/users.controller.js'
import checkRole from '../middlewares/checkRole.middleware.js'
import upload from '../middlewares/upload.middleware.js'

const usersRouter = express.Router()


usersRouter.get('/', checkRole("SUPERADMIN", "ADMIN"), usersController.getListAllUser);
usersRouter.delete('/:id', checkRole("SUPERADMIN"), usersController.disableUser);


usersRouter.patch('/status/:id', checkRole("SUPERADMIN"), usersController.updateUserStatus)


usersRouter.patch('/profile/me', upload.single('profileImage'), usersController.updateMyProfile);

usersRouter.get('/addresses', usersController.getAddressesForCurrentUser);
usersRouter.post('/addresses', usersController.addMyAddress);
usersRouter.patch('/addresses/:addressId', usersController.updateMyAddress);
usersRouter.delete('/addresses/:addressId', usersController.deleteAddress);
usersRouter.patch('/password/change', usersController.changeMyPassword);


export default usersRouter