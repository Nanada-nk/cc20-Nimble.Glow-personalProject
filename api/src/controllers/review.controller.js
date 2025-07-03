import reviewService from "../services/review.service.js";

const reviewController = {};

reviewController.create = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user.id;
    const reviewData = req.body;

    const newReview = await reviewService.createReview(Number(productId), userId, reviewData);
    res.status(201).json({ success: true, review: newReview });
};

reviewController.getByProduct = async (req, res, next) => {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(Number(productId));
    res.status(200).json({ success: true, reviews });
};

export default reviewController;