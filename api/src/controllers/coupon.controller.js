import couponService from "../services/coupon.service.js";
import { formatDates } from "../utils/formatter.js";

const couponController = {};

couponController.create = async (req, res, next) => {
    const newCoupon = await couponService.createCoupon(req.body, req.user.id);
    res.status(201).json({ success: true, coupon: formatDates(newCoupon) });
};
couponController.getAll = async (req, res, next) => {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json({ success: true, coupons : formatDates(coupons) });
};

couponController.update = async (req, res, next) => {
    try {
        const couponId = req.params.id;
        const data = req.body;

        const couponToUpdate = await couponService.findById(couponId);
        if (!couponToUpdate) {
            throw createError(404, "Coupon not found");
        }

        const updatedCoupon = await couponService.updateCoupon(couponId, data);
        res.status(200).json({ coupon: updatedCoupon });
    } catch (error) {
        next(error);
    }
};


couponController.delete = async (req, res, next) => {
    try {
        const couponId = req.params.id;

        const couponToDelete = await couponService.findById(couponId);
        if (!couponToDelete) {
            throw createError(404, "Coupon not found");
        }

        await couponService.deleteCoupon(couponId);
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
};

couponController.applyToOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const { couponCode } = req.body;
    const userId = req.user.id;
    const updatedOrder = await couponService.applyCouponToOrder(Number(orderId), couponCode, userId);
    res.status(200).json({ success: true, order: formatDates(updatedOrder) });
};

export default couponController;