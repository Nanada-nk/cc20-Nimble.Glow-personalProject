import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const orderService = {};

orderService.createOrderFromCart = async (userId, note) => {

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


    const order = await transactionClientFromPrisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${userId}`,
        cartTotal: cart.cartTotal,
        note: note,
        currency: "THB",
        cartId: cart.id,
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
      payment: true
    }
  });
}


orderService.findOrderById = async (orderId, user) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      cart: true,
      products: { include: { product: true } },
      payment: true,
      shipping: true
    }
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  if (user.role === 'CUSTOMER' && order.cart.userId !== user.id) {
    throw createError(403, "You do not have permission to view this order.");
  }

  return order;
}

orderService.updateOrderStatus = (orderId, orderStatus) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { orderStatus }
  });
}

export default orderService;