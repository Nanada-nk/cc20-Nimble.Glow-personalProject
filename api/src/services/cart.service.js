import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const cartService = {};

const updateCartTotal = async (cartId) => {
  const cartItems = await prisma.productOnCart.findMany({
    where: { cartId },
    include: { product: true },
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);

  await prisma.cart.update({ where: { id: cartId }, data: { cartTotal: total } });
};


cartService.getCartForUser = async (userId) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
}


cartService.removeItemFromCart = async (userId, cartItemId) => {

  const cartItem = await prisma.productOnCart.findUnique({
    where: { id: cartItemId },
    include: { cart: true }
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw createError(404, "Cart item not found or you do not have permission to delete it.");
  }


  await prisma.productOnCart.delete({
    where: { id: cartItemId }
  });


  await updateCartTotal(cartItem.cartId);
}


export default cartService;