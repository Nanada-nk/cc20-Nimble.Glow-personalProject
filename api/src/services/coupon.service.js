import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const couponService = {};


couponService.createCoupon = (data, creatorId) => {
  return prisma.coupon.create({ 
    data:
    {
      ...data,
      createdById: creatorId
    },
    include:{
      createdBy:{
        select:{
          firstName:true
        }
      }
    }
   })
};
couponService.getAllCoupons = () => {
  return prisma.coupon.findMany({
    include:{
      createdBy:{
        select:{
          firstName:true
        }
      }
    }
  })
}
couponService.findById = (id) => prisma.coupon.findUnique({ where: { id: Number(id) } });


couponService.updateCoupon = (id, data) => prisma.coupon.update({ where: { id: Number(id) }, data });
couponService.deleteCoupon = (id) => prisma.coupon.delete({ where: { id : Number(id) } });


couponService.applyCouponToOrder = async (orderId, couponCode, userId) => {
  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
  const order = await prisma.order.findFirst({ where: { id: orderId, cart: { userId } } });

  if (!order) throw createError(404, "Order not found.");
  if (order.couponId) throw createError(400, "Coupon already applied.");
  if (!coupon) throw createError(404, "Coupon code is invalid.");
  if (new Date() > new Date(coupon.expiredAt)) throw createError(400, "Coupon has expired.");
  if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
    throw createError(400, "Coupon has reached its usage limit.");
  }

  return prisma.$transaction(async (tx) => {
    const discountAmount = order.cartTotal * (coupon.discount / 100);

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { orderDiscount: discountAmount, couponId: coupon.id },
    });
    await tx.coupon.update({
      where: { id: coupon.id },
      data: { usageCount: { increment: 1 } },
    });
    await tx.couponUsage.create({
      data: { userId, couponId: coupon.id, orderId },
    });
    return updatedOrder;
  });
};

export default couponService;