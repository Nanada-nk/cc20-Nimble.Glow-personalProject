import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const couponService = {};


couponService.createCoupon = (data) => {
  return prisma.coupon.create({
    data: {
      code: data.code,
      discount: data.discount,
      expiredAt: new Date(data.expiredAt),
      usageLimit: data.usageLimit,
    },
  });
};


couponService.applyCouponToOrder = async (orderId, couponCode, userId) => {
  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { cart: true } });

 
  if (!order || order.cart.userId !== userId) {
    throw createError(404, "Order not found or you do not have permission.");
  }
  if (order.couponId) {
    throw createError(400, "A coupon has already been applied to this order.");
  }
  if (!coupon) {
    throw createError(404, "Coupon not found.");
  }
  if (new Date() > new Date(coupon.expiredAt)) {
    throw createError(400, "This coupon has expired.");
  }
  if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
    throw createError(400, "This coupon has reached its usage limit.");
  }


  return prisma.$transaction(async (tx) => {
    const discountAmount = order.cartTotal * (coupon.discount / 100);
    const finalTotal = order.cartTotal - discountAmount;

    
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        orderDiscount: discountAmount,
        couponId: coupon.id,
      },
    });

  
    await tx.coupon.update({
      where: { id: coupon.id },
      data: { usageCount: { increment: 1 } },
    });

   
    await tx.couponUsage.create({
      data: {
        userId: userId,
        couponId: coupon.id,
        orderId: orderId,
      },
    });

    return updatedOrder;
  });
};

export default couponService;