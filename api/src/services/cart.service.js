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
    create: { userId, cartTotal: 0 },
  });

  const existingCartItem = await prisma.productOnCart.findFirst({
    where: { cartId: cart.id, productId: productId },
  });


  const quantityInCart = existingCartItem ? existingCartItem.count : 0;
  const requestedTotalQuantity = quantityInCart + count;

  if (product.stockQuantity < requestedTotalQuantity) {
    throw createError(
      400,
      `Not enough stock for product: ${product.title}. You have ${quantityInCart} in cart, and requested ${count}. Only ${product.stockQuantity} available.`
    );
  }


  let updatedCartItem;
  if (existingCartItem) {
    updatedCartItem = await prisma.productOnCart.update({
      where: { id: existingCartItem.id },
      data: { count: requestedTotalQuantity },
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

  await updateCartTotal(cart.id);

  return updatedCartItem;
}

cartService.addItemToCart = async (userId, productId, count) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw createError(404, "Product not found");
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId, cartTotal: 0 },
  });

  const existingCartItem = await prisma.productOnCart.findFirst({
    where: { cartId: cart.id, productId: productId },
  });

  let updatedCartItem;
  if (existingCartItem) {
    updatedCartItem = await prisma.productOnCart.update({
      where: { id: existingCartItem.id },
      data: { count: existingCartItem.count + count },
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


  await updateCartTotal(cart.id);

  return updatedCartItem;
}


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