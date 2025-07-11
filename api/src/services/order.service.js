import { connect } from "http2";
import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const orderService = {};



orderService.createOrderFromCart = async (userId, data) => {
  const { note, addressId, couponId, shippingMethod } = data
  if (!addressId) {
    throw createError(400, "Shipping address is required.");
  }
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { products: { include: { product: true } } },
  });

  if (!cart || cart.products.length === 0) {
    throw createError(400, "Cart is empty. Cannot create an order.");
  }


  const newOrder = await prisma.$transaction(async (transactionClientFromPrisma) => {

    for (const item of cart.products) {
      if (item.product.stockQuantity < item.count) {
        throw createError(400, `Not enough stock for product: ${item.product.title}`);
      }
    }
    let finalTotal = cart.cartTotal;
    let orderDiscount = 0;
    let appliedCoupon = null;

    if (couponId) {
      appliedCoupon = await transactionClientFromPrisma.coupon.findUnique({ where: { id: Number(couponId) } });
      if (!appliedCoupon) throw createError(404, "Coupon not found.");
      if (new Date() > new Date(appliedCoupon.expiredAt)) throw createError(400, "Coupon has expired.");
      orderDiscount = cart.cartTotal * (appliedCoupon.discount / 100);
      finalTotal = cart.cartTotal - orderDiscount;
    }
    const order = await transactionClientFromPrisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${userId}`,
        cartTotal: cart.cartTotal,
        orderDiscount: orderDiscount,
        note: note,
        currency: "THB",
        cart: {
          connect: {
            id: cart.id
          }
        },
        coupon: couponId ? {
          connect: {
            id: Number(couponId)
          }
        } : undefined,
      },
    });


    await transactionClientFromPrisma.productOnOrder.createMany({
      data: cart.products.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        count: item.count,
        price: item.price,
      })),
    });


    for (const item of cart.products) {
      await transactionClientFromPrisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.count } },
      });
    }

    await transactionClientFromPrisma.payment.create({
      data: {
        orderId: order.id,
        userId: userId,
        amount: finalTotal,
        status: 'PENDING',
        method: 'PROMPTPAY'
      }
    })


    await transactionClientFromPrisma.shipping.create({
      data: {
        orderId: order.id,
        addressId: addressId,
        status: 'PENDING',
        method: shippingMethod || 'THAILAND_POST'
      }
    })

    if (appliedCoupon) {
      await transactionClientFromPrisma.coupon.update({
        where: { id: appliedCoupon.id },
        data: { usageCount: { increment: 1 } },
      });
      await transactionClientFromPrisma.couponUsage.create({
        data: { userId, couponId: appliedCoupon.id, orderId: order.id },
      });
    }


    await transactionClientFromPrisma.productOnCart.deleteMany({
      where: { cartId: cart.id },
    });

    await transactionClientFromPrisma.cart.update({
      where: { id: cart.id },
      data: { cartTotal: 0 }
    });


    return order;
  });




  return prisma.order.findUnique({
    where: { id: newOrder.id },
    include: { products: { include: { product: true } } },
  });
}


orderService.findOrdersByUserId = (userId) => {
  return prisma.order.findMany({
    where: { cart: { userId: userId } },
    orderBy: { createdAt: 'desc' },
    include: {
      products: { include: { product: { select: { title: true, id: true } } } },
      payment: true,
      shipping: {
        include: {
          address: true
        }
      }
    }
  });
}


orderService.findOrderById = async (orderId, user) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      cart: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      },
      products: {
        include: {
          product: {
            include: {
              images: true,
              reviews: {
                where: {
                  userId: user.id
                },
                include: {
                  images: true
                }
              }
            }
          }
        }
      },
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          method: true
        }
      },
      shipping: {
        include: {
          address: true
        }
      }
    }
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  if (user.role === 'CUSTOMER' && order.cart.userId !== user.id) {
    throw createError(403, "You do not have permission to view this order.");
  }

  console.log("--- Backend Service: Order data before sending ---");
  console.log(order);

  return order;
}

orderService.findAllAdmin = () => {
  return prisma.order.findMany({
    include: {
      cart: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      },
      payment: true,
      shipping: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

orderService.updateOrderStatus = (orderId, orderStatus) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { orderStatus }
  });
}

orderService.updateAdminOrderDetails = (orderId, data) => {
  const { orderStatus, trackingNumber } = data;

  return prisma.$transaction(async (transactionClientFromPrisma) => {
    let updatedOrder;


    if (orderStatus) {
      updatedOrder = await transactionClientFromPrisma.order.update({
        where: { id: Number(orderId) },
        data: { orderStatus },
      });
    }


    if (trackingNumber !== undefined) {
      await transactionClientFromPrisma.shipping.upsert({
        where: { orderId: Number(orderId) },
        update: { trackingNumber },
        create: {
          order: { connect: { id: Number(orderId) } },
          trackingNumber: trackingNumber,
          status: 'PENDING',
          method: 'THAILAND_POST'
        },
      });
    }


    const finalOrder = await transactionClientFromPrisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        shipping: true,

      }
    });

    return finalOrder;
  });
};

export default orderService;