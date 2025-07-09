import express from 'express';
import authenticateUser from '../middlewares/authenticate.middleware.js';
import checkRole from '../middlewares/checkRole.middleware.js';
import couponController from '../controllers/coupon.controller.js';

const couponRouter = express.Router();

couponRouter.get('/', couponController.getAll)
couponRouter.post('/', authenticateUser, checkRole("ADMIN", "SUPERADMIN"), couponController.create);

couponRouter.patch('/:id', authenticateUser, checkRole("ADMIN", "SUPERADMIN"), couponController.update);
couponRouter.delete('/:id', authenticateUser, checkRole("ADMIN", "SUPERADMIN"), couponController.delete);

couponRouter.patch('/apply/orders/:orderId', authenticateUser, checkRole("CUSTOMER"), couponController.applyToOrder);


export default couponRouter;