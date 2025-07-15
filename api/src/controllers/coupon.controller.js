/** @format */

import couponService from "../services/coupon.service.js";


const couponController = {};

couponController.create = async (req, res, next) => {
  const data = req.body;
  // console.log("data", data);
  if (data.expiredAt && isNaN(new Date(data.expiredAt).getTime())) {
    throw createError(400, "Invalid format for expiredAt.");
  }

  const newCoupon = await couponService.createCoupon(req.body, req.user.id);
  // console.log("newCoupon", newCoupon);
  res.status(201).json({ success: true, coupon: newCoupon });
};
couponController.getAll = async (req, res, next) => {
  const coupons = await couponService.getAllCoupons();
  // console.log("coupons", coupons);
  res.status(200).json({ success: true, coupons: coupons });
};

couponController.getAvailable = async (req, res, next) => {
  const coupons = await couponService.findAvailableCoupons();
  // console.log("coupons", coupons);
  res.status(200).json({ success: true, coupons: coupons });
};

couponController.update = async (req, res, next) => {
  const couponId = req.params.id;
  const data = req.body;

  const couponToUpdate = await couponService.findById(couponId);
  // console.log("couponToUpdate", couponToUpdate);
  if (!couponToUpdate) {
    throw createError(404, "Coupon not found");
  }

  const updatedCoupon = await couponService.updateCoupon(couponId, data);
  // console.log("updatedCoupon", updatedCoupon);
  res.status(200).json({ coupon: updatedCoupon });
};

couponController.delete = async (req, res, next) => {
  const couponId = req.params.id;

  const couponToDelete = await couponService.findById(couponId);
  // console.log("couponToDelete", couponToDelete);
  if (!couponToDelete) {
    throw createError(404, "Coupon not found");
  }

  await couponService.deleteCoupon(couponId);
  res.status(204).send();
};

couponController.applyToOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { couponCode } = req.body;
  const userId = req.user.id;
  const updatedOrder = await couponService.applyCouponToOrder(
    Number(orderId),
    couponCode,
    userId
  );
  // console.log("updatedOrder", updatedOrder);
  res.status(200).json({ success: true, order: updatedOrder });
};

export default couponController;
