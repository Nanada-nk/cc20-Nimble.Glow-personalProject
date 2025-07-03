import prisma from "../config/prisma.config.js";

const shippingService = {};

shippingService.getShippingMethods = () => {
  
    return Object.values(prisma.ShippingMethod);
};

shippingService.getShippingStatusForOrder = (orderId) => {
    return prisma.shipping.findUnique({
        where: { orderId: orderId }
    });
};

shippingService.updateShippingForOrder = async (orderId, shippingData) => {
  return prisma.shipping.upsert({
    where: { orderId: orderId },
    update: {
      status: shippingData.status,
      trackingNumber: shippingData.trackingNumber,
      shippedAt: shippingData.shippedAt ? new Date(shippingData.shippedAt) : undefined,
      deliveredAt: shippingData.deliveredAt ? new Date(shippingData.deliveredAt) : undefined,
    },
    create: {
      orderId: orderId,
      status: shippingData.status,
      trackingNumber: shippingData.trackingNumber,
     
    },
  });
};

export default shippingService;