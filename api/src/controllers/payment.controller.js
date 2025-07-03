import paymentService from "../services/payment.service.js";

const paymentController = {};

paymentController.getMethods = (req, res) => {
    const methods = paymentService.getPaymentMethods();
    res.status(200).json({ success: true, methods });
};

paymentController.payForOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const paymentData = req.body;

    const newPayment = await paymentService.createPaymentForOrder(Number(orderId), userId, paymentData);
    res.status(201).json({ success: true, payment: newPayment });
};

paymentController.getPaymentForOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const payment = await paymentService.getPaymentByOrderId(Number(orderId), userId);
    res.status(200).json({ success: true, payment });
};

paymentController.refundPayment = async (req, res) => {
    const { id } = req.params; 
    const refundData = req.body;
    const newRefund = await paymentService.createRefund(Number(id), refundData);
    res.status(201).json({ success: true, refund: newRefund });
};

export default paymentController;