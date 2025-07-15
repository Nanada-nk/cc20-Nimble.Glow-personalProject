import express from 'express';
import authenticateUser from '../middlewares/authenticate.middleware.js';
import checkRole from '../middlewares/checkRole.middleware.js';
import shippingController from '../controllers/shipping.controller.js';

const shippingRouter = express.Router();


shippingRouter.get('/methods', shippingController.getMethods);
shippingRouter.get('/orders/:orderId/shipping', authenticateUser, checkRole("CUSTOMER"), shippingController.getStatus)
shippingRouter.patch('/orders/:orderId', authenticateUser, shippingController.updateShipping);

export default shippingRouter