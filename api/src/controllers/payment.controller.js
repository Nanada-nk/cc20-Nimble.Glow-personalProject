import paymentService from "../services/payment.service.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from 'fs/promises';
import createError from '../utils/create-error.js';

const paymentController = {};

paymentController.getMethods = (req, res, next) => {
    const methods = paymentService.getPaymentMethods();
    console.log('methods', methods)
    res.status(200).json({ success: true, methods });
    
};

paymentController.uploadSlip = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    if (!req.file) {
      throw createError(400, "Slip image is required.");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "nimble-glow-slips",
    });
    console.log('result', result)
    
    const updatedPayment = await paymentService.handleSlipUpload(
      paymentId,
      result.secure_url
    );
    console.log('updatedPayment', updatedPayment)

    res.status(200).json({
      success: true,
      message: "Slip uploaded and confirmation sent.",
      payment: updatedPayment,
    });
  } catch (error) {
    next(error);
  } finally {
    
    if (req.file?.path) {
      await fs.unlink(req.file.path);
    }
  }
}

paymentController.payForOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const paymentData = req.body;

    const newPayment = await paymentService.createPaymentForOrder(Number(orderId), userId, paymentData);
    console.log('newPayment', newPayment)
    res.status(201).json({ success: true, payment: newPayment });
    
};

paymentController.getPaymentForOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const payment = await paymentService.getPaymentByOrderId(Number(orderId), userId);
    res.status(200).json({ success: true, payment: payment });
};

paymentController.refundPayment = async (req, res, next) => {
    const { id } = req.params;
    const refundData = req.body;
    const newRefund = await paymentService.createRefund(Number(id), refundData);
    res.status(201).json({ success: true, refund: newRefund });
}

paymentController.updatePaymentStatus = async (req, res, next) => {
    const { paymentId } = req.params;
    const { status } = req.body;

    const updatedPayment = await paymentService.updatePaymentStatus(Number(paymentId), status);
    res.status(200).json({ success: true, payment: updatedPayment });
};



export default paymentController;