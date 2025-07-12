import reviewService from "../services/review.service.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs/promises"

const reviewController = {};

const uploadReviewImages = async (files) => {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: 'nimble-glow-reviews' })
    );
    try {
        const results = await Promise.all(uploadPromises);
        return results.map(result => result.secure_url);
    } finally {
        const unlinkPromises = files.map(file => fs.unlink(file.path));
        await Promise.all(unlinkPromises);
    }
}

reviewController.create = async (req, res, next) => {
    const productOnOrderId  = Number(req.params.productOnOrderId );
    const userId = req.user.id
    
    const { rating, comment } = req.body;
    const newImageUrls = await uploadReviewImages(req.files)
    const reviewData = { rating: Number(rating), comment, images: newImageUrls }
    const newReview = await reviewService.createReview(productOnOrderId, userId, reviewData);
    res.status(201).json({ success: true, review: newReview });
};

reviewController.getAll = async (req, res, next) => {
    const reviews = await reviewService.findAllReviews();
    res.status(200).json({ success: true, reviews: reviews });
};


reviewController.getByProduct = async (req, res, next) => {
    const productId = Number(req.params.productId);
    const reviews = await reviewService.getReviewsForProduct(productId);
    res.status(200).json({ success: true, reviews: reviews });
};

reviewController.update = async (req, res, next) => {
    const { reviewId } = req.params;
    const { id: userId } = req.user;

    const reviewToUpdate = await reviewService.findById(reviewId);
    if (!reviewToUpdate) throw createError(404, "Review not found");
    if (reviewToUpdate.userId !== userId) throw createError(403, "You are not allowed to edit this review.");

    const updatedReview = await reviewService.update(reviewId, req.body);
    res.status(200).json({ success: true, review: updatedReview });
};



export default reviewController;