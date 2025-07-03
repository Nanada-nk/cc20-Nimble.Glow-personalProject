import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const cartService = {};

cartService.addItemToCart = async (userId, productId, count) => {

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw createError(404, "Product not found");
  }


  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      cartTotal: 0,
    },
  });


  const existingCartItem = await prisma.productOnCart.findFirst({
    where: {
      cartId: cart.id,
      productId: productId,
    },
  });

  let updatedCartItem;
  if (existingCartItem) {

    updatedCartItem = await prisma.productOnCart.update({
      where: { id: existingCartItem.id },
      data: {
        count: existingCartItem.count + count,
      },
    });
  } else {

    updatedCartItem = await prisma.productOnCart.create({
      data: {
        cartId: cart.id,
        productId: productId,
        count: count,
        price: product.price,
      },
    });
  }


  return updatedCartItem;
};

export default cartService;