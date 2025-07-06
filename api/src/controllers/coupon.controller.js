import couponService from "../services/coupon.service.js";
import { formatDates } from "../utils/formatter.js";

const couponController = {};

couponController.create = async (req, res, next) => {
    const newCoupon = await couponService.createCoupon(req.body);
    res.status(201).json({ success: true, coupon: formatDates(newCoupon) });
};
couponController.getAll = async (req, res, next) => {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json({ success: true, coupons : formatDates(coupons) });
};


couponController.applyToOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const { couponCode } = req.body;
    const userId = req.user.id;
    const updatedOrder = await couponService.applyCouponToOrder(Number(orderId), couponCode, userId);
    res.status(200).json({ success: true, order: formatDates(updatedOrder) });
};

export default couponController;