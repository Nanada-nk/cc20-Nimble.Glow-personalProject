import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";
import { PaymentMethod } from "../generated/prisma/client.js"
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs/promises"

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

paymentService.handleSlipUpload = async (paymentId, file) => {
  const payment = await prisma.payment.findUnique({ where: { id: Number(paymentId) } });
  if (!payment) {
    throw createError(404, "Payment record not found.");
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'nimble-glow-slips'
  });

  await fs.unlink(file.path);
  const [, updatedPayment] = await prisma.$transaction([
    prisma.order.update({
      where: { id: payment.orderId },
      data: { orderStatus: 'PAID' }
    }),
    prisma.payment.update({
      where: { id: Number(paymentId) },
      data: {
        status: 'PAID',
        slipImageUrl: result.secure_url
      }
    })
  ]);

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