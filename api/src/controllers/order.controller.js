import { OrderStatus } from "../generated/prisma/client.js"
import orderService from "../services/order.service.js";
import createError from "../utils/create-error.js";


const ordersController = {};

ordersController.createOrder = async (req, res, next) => {
  const userId = req.user.id;
  const data = req.body;

  const newOrder = await orderService.createOrderFromCart(userId, data);
  // console.log('newOrder', newOrder)
  res.status(201).json({ success: true, order: newOrder });
  
}

ordersController.getUserOrders = async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.findOrdersByUserId(userId);
  // console.log('orders', orders)
  res.status(200).json({ success: true, orders: orders })
  
}

ordersController.getOrderById = async (req, res, next) => {
  const orderId = Number(req.params.id);
  const user = req.user
  const order = await orderService.findOrderById(orderId, user);
  // console.log('order', order)
  res.status(200).json({ success: true, order: order })
  
}

ordersController.getAllAdmin = async (req, res, next) => {
 
    const orders = await orderService.findAllAdmin();
    // console.log('orders', orders)
    res.status(200).json({ success: true, orders: orders });
    
 
};

ordersController.updateStatus = async (req, res, next,) => {
  const orderId = Number(req.params.id);
  // console.log('orderId', orderId)
  const { orderStatus } = req.body;

  if (!orderStatus) {
    throw createError(400, "orderStatus is required.");
  }

  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(orderStatus)) {
    throw createError(
      400,
      `Invalid status: '${orderStatus}'. Valid statuses are: ${validStatuses.join(", ")}`
    );
  }

  const updatedOrder = await orderService.updateOrderStatus(
    orderId,
    orderStatus
  );
  // console.log('updatedOrder', updatedOrder)
  res.status(200).json({ success: true, order: updatedOrder });
  
}

ordersController.updateAdminDetails = async (req, res, next) => {

  const orderId = Number(req.params.id);
  const data = req.body;
  const updatedOrder = await orderService.updateAdminOrderDetails(orderId, data);
  // console.log('updatedOrder', updatedOrder)
  res.status(200).json({ success: true, order: updatedOrder });
  
};


export default ordersController;