import paymentService from "../services/payment.service.js";
import { formatDates } from "../utils/formatter.js";

const paymentController = {};

paymentController.getMethods = (req, res, next) => {
    const methods = paymentService.getPaymentMethods();
    res.status(200).json({ success: true, methods });
};

paymentController.payForOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const paymentData = req.body;

    const newPayment = await paymentService.createPaymentForOrder(Number(orderId), userId, paymentData);
    res.status(201).json({ success: true, payment: formatDates(newPayment) });
};

paymentController.getPaymentForOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const payment = await paymentService.getPaymentByOrderId(Number(orderId), userId);
    res.status(200).json({ success: true, payment: formatDates(payment) });
};

paymentController.refundPayment = async (req, res, next) => {
    const { id } = req.params;
    const refundData = req.body;
    const newRefund = await paymentService.createRefund(Number(id), refundData);
    res.status(201).json({ success: true, refund: formatDates(newRefund) });
}

paymentController.updatePaymentStatus = async (req, res, next) => {
    const { paymentId } = req.params;
    const { status } = req.body;

    const updatedPayment = await paymentService.updatePaymentStatus(Number(paymentId), status);
    res.status(200).json({ success: true, payment: formatDates(updatedPayment) });
};

export default paymentController;