import express from 'express';
import authenticateUser from '../middlewares/authenticate.middleware.js';
import checkRole from '../middlewares/checkRole.middleware.js';
import paymentController from '../controllers/payment.controller.js';


const paymentRouter = express.Router();


paymentRouter.get('/methods', paymentController.getMethods)
paymentRouter.post('/orders/:orderId/pay', authenticateUser, checkRole("CUSTOMER"), paymentController.payForOrder)
paymentRouter.get('/orders/:orderId/payment', authenticateUser, checkRole("CUSTOMER"), paymentController.getPaymentForOrder)
paymentRouter.post('/:id/refund', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), paymentController.refundPayment)
paymentRouter.patch('/:paymentId/status', authenticateUser, checkRole("SUPERADMIN", "ADMIN"), paymentController.updatePaymentStatus);


export default paymentRouter