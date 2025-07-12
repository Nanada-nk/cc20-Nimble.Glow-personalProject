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
  res.status(200).json({ success: true, cartItem })
}


cartController.getCart = async (req, res, next) => {
 
    const userId = req.user.id;
    console.log('userId', userId)
    const cart = await cartService.getCartForUser(userId);
    console.log('cart', cart)

    if (!cart) {
      return res.status(200).json({ success: true, cart: null });
    }

    res.status(200).json({ success: true, cart: cart })
 
    
    
  
}


cartController.removeItem = async (req, res, next) => {
  const userId = req.user.id;
  const cartItemId = Number(req.params.itemId);

  await cartService.removeItemFromCart(userId, cartItemId);


  res.status(204).send()
}

export default cartController