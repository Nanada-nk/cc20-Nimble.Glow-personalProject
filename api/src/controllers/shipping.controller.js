import shippingService from "../services/shipping.service.js";
import { formatDates } from "../utils/formatter.js";

const shippingController = {};

shippingController.getMethods = (req, res, next) => {
    console.log("--- API /api/shipping/methods was called ---")
    const methods = shippingService.getShippingMethods();
    console.log("--- shippingService.getMethods() was successful ---")
    console.log('methods', methods)
    res.status(200).json({ success: true, methods });
    console.error("--- SHIPPING CONTROLLER CRASHED ---", error)
    console.error(error)
};

shippingController.getStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const shipping = await shippingService.getShippingStatusForOrder(Number(orderId));
    res.status(200).json({ success: true, shipping: formatDates(shipping) });
};

// // version1
// shippingController.updateStatus = async (req, res, next) => {
//     const { orderId } = req.params;
//     const shippingData = req.body;
//     const updatedShipping = await shippingService.updateShippingForOrder(Number(orderId), shippingData);
//     res.status(200).json({ success: true, shipping: formatDates(updatedShipping) });
// };

shippingController.updateShipping = async (req, res, next) => {
    const { orderId } = req.params;
    const shippingData = req.body;
    const updatedShipping = await shippingService.upsertShipping(orderId, shippingData);
    res.status(200).json({ success: true, shipping: formatDates(updatedShipping) });
};

export default shippingController;