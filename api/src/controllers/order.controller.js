import { OrderStatus } from "../generated/prisma/client.js"
import orderService from "../services/orders.service.js";
import createError from "../utils/create-error.js";

const ordersController = {};

ordersController.createOrder = async (req, res, next) => {
  const userId = req.user.id;
  const { note } = req.body;

  const newOrder = await orderService.createOrderFromCart(userId, note);
  res.status(201).json({ success: true, order: newOrder });
}

ordersController.getUserOrders = async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.findOrdersByUserId(userId);
  res.status(200).json({ success: true, orders: formatDates(orders) })
}

ordersController.getOrderById = async (req, res, next) => {
  const orderId = Number(req.params.id);
  const user = req.user
  const order = await orderService.findOrderById(orderId, user);
  res.status(200).json({ success: true, orders: formatDates(order) })
}

ordersController.updateStatus = async (req, res, next,) => {
  const orderId = Number(req.params.id);
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
  res.status(200).json({ success: true, order: updatedOrder });
}

export default ordersController;