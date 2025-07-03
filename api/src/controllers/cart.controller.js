import cartService from "../services/cart.service.js";
import createError from "../utils/create-error.js";

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  const { productId, count } = req.body;
  const userId = req.user.id;

  if (!productId || count === undefined) {
    throw createError(400, "productId and count are required");
  }

  if (typeof count !== 'number' || count <= 0) {
    throw createError(400, "Count must be a positive number");
  }

  const cartItem = await cartService.addItemToCart(userId, productId, count);
  res.status(200).json({ success: true, cartItem })
};


cartController.getCart = async (req, res) => {
  const userId = req.user.id;
  const cart = await cartService.getCartForUser(userId);

  if (!cart) {
    return res.status(200).json({ success: true, cart: null });
  }

  res.status(200).json({ success: true, cart })
};


cartController.removeItem = async (req, res) => {
  const userId = req.user.id;
  const cartItemId = Number(req.params.itemId);

  const removeItem = await cartService.removeItemFromCart(userId, cartItemId);


  res.status(204).json({ success: true, removeItem })
};

export default cartController