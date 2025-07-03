import express from 'express';
import checkRole from '../middlewares/checkRole.middleware.js';
import couponController from '../controllers/coupon.controller.js';

const couponRouter = express.Router();


couponRouter.post('/', checkRole("SUPERADMIN", "ADMIN"), couponController.create);
couponRouter.post('/apply/orders/:orderId', checkRole("CUSTOMER"), couponController.applyCoupon);

export default couponRouter;