import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";
import { PaymentMethod } from "../generated/prisma/client.js"
import emailService from "./email.service.js";


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


paymentService.handleSlipUpload = async (paymentId, slipImageUrl) => {
 
  const payment = await prisma.payment.findUnique({
    where: { id: Number(paymentId) },
  });

  if (!payment) {
    throw createError(404, "Payment record not found.");
  }
  if (!payment.orderId) {
    throw createError(404, "Order not found for this payment.");
  }
  
 
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: Number(paymentId) },
      data: { status: "PAID", slipImageUrl: slipImageUrl },
    }),
    prisma.order.update({
     
      where: { id: payment.orderId },
      data: { orderStatus: "PAID" },
    }),
  ]);

  
  const updatedPayment = await prisma.payment.findUnique({
    where: { id: Number(paymentId) },
    include: {
      user: { select: { email: true, firstName: true } },
      order: {
        include: {
          products: { include: { product: { include: { images: true } } } },
          shipping: { include: { address: true } },
        },
      },
    },
  });

  if (!updatedPayment) {
    throw createError(500, "Failed to retrieve updated payment details for email.");
  }
  
  
  if (updatedPayment.user) {
    await emailService.sendPaymentConfirmationEmail(updatedPayment);
  }

  return updatedPayment;
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

  return Object.values(PaymentMethod);
};

paymentService.updatePaymentStatus = async (paymentId, status) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    throw createError(404, "Payment not found.");
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: { status }
  });
};


export default paymentService;