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

// // version 1
// shippingService.updateShippingForOrder = async (orderId, shippingData) => {
//   const { status, trackingNumber, shippedAt, deliveredAt, method, fee, addressId } = shippingData;
//   return prisma.shipping.upsert({
//     where: { orderId: Number(orderId) },
//     update: {
//       addressId: Number(addressId),
//       status,
//       trackingNumber,
//       method,
//       fee,
//       shippedAt: shippedAt ? new Date(shippedAt) : undefined,
//       deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
//     },
//     create: {
//       orderId: orderId,
//       status,
//       trackingNumber,
//       method,
//       fee,
//       addressId,
//     },
//   });
// };

shippingService.upsertShipping = (orderId, shippingData) => {

  if (shippingData.addressId) shippingData.addressId = Number(shippingData.addressId);
  if (shippingData.fee) shippingData.fee = Number(shippingData.fee);

  return prisma.shipping.upsert({
    where: { orderId: Number(orderId) },
    update: shippingData,
    create: {
      orderId: Number(orderId),
      method: 'PICKUP',
      status: 'PENDING',
      ...shippingData
    }
  });
};

export default shippingService;