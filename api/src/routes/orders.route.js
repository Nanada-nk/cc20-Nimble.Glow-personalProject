import express from 'express'
import checkRole from '../middlewares/checkRole.middleware.js'
import couponController from '../controllers/coupon.controller.js'

const couponRouter = express.Router();

couponRouter.get('/', checkRole("ADMIN", "SUPERADMIN"), couponController.getAll);
couponRouter.post('/', checkRole("ADMIN", "SUPERADMIN"), couponController.create);
couponRouter.patch('/apply/orders/:orderId', checkRole("CUSTOMER"), couponController.applyToOrder);

export default couponRouter;