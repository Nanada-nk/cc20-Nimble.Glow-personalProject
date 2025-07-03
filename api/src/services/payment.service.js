import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const paymentService = {};

paymentService.createPaymentForOrder = async (orderId, userId, paymentData) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { cart: true },
  });

  if (!order || order.cart.userId !== userId) {
    throw createError(404, "Order not found or you do not have permission.");
  }
  if (order.payment) {
    throw createError(400, "Payment for this order already exists.");
  }

  const finalAmount = order.cartTotal - (order.orderDiscount || 0);

 
  if (finalAmount !== paymentData.amount) {
      throw createError(400, `Payment amount is incorrect. Required: ${finalAmount}`);
  }

  return prisma.payment.create({
    data: {
      amount: finalAmount,
      method: paymentData.method,
      status: 'PENDING',
      orderId: orderId,
      userId: userId,
    },
  });
};


paymentService.getPaymentByOrderId = (orderId, userId) => {
    return prisma.payment.findFirst({
        where: {
            orderId: orderId,
            userId: userId
        }
    });
};


paymentService.createRefund = (paymentId, refundData) => {
    return prisma.paymentRefund.create({
        data: {
            paymentId: paymentId,
            amount: refundData.amount,
            reason: refundData.reason
        }
    });
};


paymentService.getPaymentMethods = () => {

    return Object.values(prisma.PaymentMethod);
};


export default paymentService;