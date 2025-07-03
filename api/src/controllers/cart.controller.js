import cartService from "../services/cart.service.js";
import createError from "../utils/create-error.js";

const cartController = {};

cartController.addItemToCart = async (req, res, next) => {
  const { productId, count } = req.body;
  const userId = req.user.id;

  if (!productId || count === undefined) {
    throw createError(400, "productId and count are required");
  }

  if (typeof count !== 'number' || count <= 0) {
    throw createError(400, "Count must be a positive number");
  }

  const cartItem = await cartService.addItemToCart(userId, productId, count);
  res.status(200).json({ success: true, cartItem });
};


cartController.getCart = async (req, res, next) => {
  res.status(501).json({ message: "Get Cart Not Implemented" });
};

cartController.removeItem = async (req, res, next) => {
  res.status(501).json({ message: "Remove Item Not Implemented" });
};


export default cartController;