import express from 'express';
import ordersController from '../controllers/order.controller.js';
import checkRole from '../middlewares/checkRole.middleware.js';


const ordersRouter = express.Router();


ordersRouter.get('/admin', checkRole("SUPERADMIN", "ADMIN"), ordersController.getAllAdmin);
ordersRouter.patch('/admin/:id', checkRole("SUPERADMIN", "ADMIN"), ordersController.updateAdminDetails)
ordersRouter.get('/', ordersController.getUserOrders);
ordersRouter.post('/', ordersController.createOrder);
ordersRouter.get('/:id', ordersController.getOrderById);
ordersRouter.patch('/:id/status', checkRole("SUPERADMIN", "ADMIN"), ordersController.updateStatus);


export default ordersRouter;