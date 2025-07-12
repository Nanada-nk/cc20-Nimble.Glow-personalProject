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


shippingService.upsertShipping = (orderId, shippingData) => {

  const {
    trackingNumber,
    method,
    status,
    shippedAt,
    deliveredAt,
    fee,
    addressId
  } = shippingData;

  const safeUpdateData = {
    trackingNumber,
    method,
    status,
    fee: fee ? Number(fee) : undefined,
    addressId: addressId ? Number(addressId) : undefined,
    shippedAt: shippedAt ? new Date(shippedAt) : undefined,
    deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
  };
  Object.keys(safeUpdateData).forEach(key => safeUpdateData[key] === undefined && delete safeUpdateData[key]);


  return prisma.shipping.upsert({
    where: { orderId: Number(orderId) },
    update: safeUpdateData,
    create: {
      order: { connect: { id: Number(orderId) } },
      ...safeUpdateData,

      method: safeUpdateData.method || 'PICKUP',
      status: safeUpdateData.status || 'PENDING',
    }
  });
};

export default shippingService;