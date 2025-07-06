import prisma from "../config/prisma.config.js";
import { ShippingMethod } from "../generated/prisma/client.js"

const shippingService = {};

shippingService.getShippingMethods = () => {
  return Object.values(ShippingMethod);
};

shippingService.getShippingStatusForOrder = (orderId) => {
  return prisma.shipping.findUnique({
    where: { orderId: orderId }
  });
};


shippingService.updateShippingForOrder = async (orderId, shippingData) => {
  const { status, trackingNumber, shippedAt, deliveredAt, method, fee, addressId } = shippingData;
  return prisma.shipping.upsert({
    where: { orderId: orderId },
    update: {
      status,
      trackingNumber,
      method,
      fee,
      shippedAt: shippedAt ? new Date(shippedAt) : undefined,
      deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
    },
    create: {
      orderId: orderId,
      status,
      trackingNumber,
      method,
      fee,
      addressId,
    },
  });
};

export default shippingService;