import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const cartService = {};

const updateCartTotal = async (cartId) => {
  const cartItems = await prisma.productOnCart.findMany({
    where: { cartId },
    include: { product: true },
  });
  console.log('cartItems', cartItems)
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
  console.log('total', total)
  await prisma.cart.update({ where: { id: cartId }, data: { cartTotal: total } });
}

cartService.addItemToCart = async (userId, productId, count) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  console.log('product', product)

  if (!product) throw createError(404, "Product not found");

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId, cartTotal: 0 },
  });
  console.log('cart', cart)

  const existingCartItem = await prisma.productOnCart.findFirst({
    where: { cartId: cart.id, productId: productId },
  });
  console.log('existingCartItem', existingCartItem)

  const quantityInCart = existingCartItem ? existingCartItem.count : 0;
  console.log('quantityInCart', quantityInCart)

  const requestedTotalQuantity = quantityInCart + count;
  console.log('requestedTotalQuantity', requestedTotalQuantity)

  if (product.stockQuantity < requestedTotalQuantity) {
    throw createError(400, `Not enough stock for product: ${product.title}. Only ${product.stockQuantity} available.`);
  }

  const updatedCartItem = existingCartItem ?
    await prisma.productOnCart.update({ where: { id: existingCartItem.id }, data: { count: requestedTotalQuantity } }) :
    await prisma.productOnCart.create({ data: { cartId: cart.id, productId, count, price: product.price } });
  console.log('updatedCartItem', updatedCartItem)

  await updateCartTotal(cart.id);
  return updatedCartItem;
};


cartService.getCartForUser = async (userId) => {
  try {
    console.log(`[Cart Service] Attempting to fetch cart for userId: ${userId}`)
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          },
        },
      },
    })
    console.log('[Cart Service] Successfully fetched cart data.')
    return cart;
  } catch (error) {
    next(error)
  }
}


cartService.removeItemFromCart = async (userId, cartItemId) => {

  const cartItem = await prisma.productOnCart.findFirst({
    where: { id: cartItemId, cart: { userId } },
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