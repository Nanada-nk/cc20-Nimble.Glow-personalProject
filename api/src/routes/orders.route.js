import express from 'express';
import ordersController from '../controllers/order.controller.js';
import checkRole from '../middlewares/checkRole.middleware.js';


const ordersRouter = express.Router();


ordersRouter.post('/', ordersController.createOrder);
ordersRouter.get('/admin', checkRole("SUPERADMIN", "ADMIN"), ordersController.getAllAdmin);
ordersRouter.get('/', ordersController.getUserOrders);
ordersRouter.get('/:id', ordersController.getOrderById);
ordersRouter.patch('/:id/status', checkRole("SUPERADMIN", "ADMIN"), ordersController.updateStatus);

export default ordersRouter;