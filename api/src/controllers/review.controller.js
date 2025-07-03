import reviewService from "../services/review.service.js";

const reviewController = {};

reviewController.create = async (req, res, next) => {
    const { productId } = req.params;
    const newReview = await reviewService.createReviewForProduct(Number(productId), req.user.id, req.body);
    res.status(201).json({ success: true, review: newReview });
};

reviewController.getByProduct = async (req, res, next) => {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsForProduct(Number(productId));
    res.status(200).json({ success: true, reviews });
};

reviewController.update = async (req, res, next) => {
    const { reviewId } = req.params;
    const updatedReview = await reviewService.updateReview(Number(reviewId), req.user.id, req.body);
    res.status(200).json({ success: true, review: updatedReview });
};

reviewController.delete = async (req, res, next) => {
    const { reviewId } = req.params;
    await reviewService.deleteReview(Number(reviewId), req.user.id);
    res.status(204).send();
};

export default reviewController;