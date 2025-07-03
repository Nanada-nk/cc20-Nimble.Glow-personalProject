import couponService from "../services/coupon.service.js";

const couponController = {};

couponController.create = async (req, res, next) => {
  const couponData = req.body;
  const newCoupon = await couponService.createCoupon(couponData);
  res.status(201).json({ success: true, coupon: newCoupon });
};

couponController.applyCoupon = async (req, res, next) => {
  const { orderId } = req.params;
  const { couponCode } = req.body;
  const userId = req.user.id;

  const updatedOrder = await couponService.applyCouponToOrder(Number(orderId), couponCode, userId);
  res.status(200).json({ success: true, message: "Coupon applied successfully", order: updatedOrder });
};

export default couponController;