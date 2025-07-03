import express from 'express';
import checkRole from '../middlewares/checkRole.middleware.js';
import ordersController from '../controllers/orders.controller.js';

const ordersRouter = express.Router();

ordersRouter.get('/', checkRole("CUSTOMER"), ordersController.getUserOrders);
ordersRouter.post('/', checkRole("CUSTOMER"), ordersController.createOrder);
ordersRouter.get('/:id', checkRole("CUSTOMER", "ADMIN", "SUPERADMIN"), ordersController.getOrderById);
ordersRouter.patch('/:id/status', checkRole("SUPERADMIN", "ADMIN"), ordersController.updateStatus);

export default ordersRouter;