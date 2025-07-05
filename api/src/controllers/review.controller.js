import reviewService from "../services/review.service.js";
import { formatDates } from "../utils/formatter.js";

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
    const productId = Number(req.params);
    const userId = req.user.id
    const reviewData = req.body

    const newImageUrls = await uploadReviewImages(req.files)
    reviewData.images = newImageUrls

    const newReview = await reviewService.createReviewForProduct(productId, userId, reviewData);
    res.status(201).json({ success: true, review: formatDates(newReview) });
};

reviewController.getByProduct = async (req, res, next) => {
    const productId = Number(req.params);
    const reviews = await reviewService.getReviewsForProduct(productId);
    res.status(200).json({ success: true, reviews });
};

reviewController.update = async (req, res, next) => {
    const reviewId = Number(req.params);
    const userId = req.user.id;
    const dataToUpdate = req.body;

    const newImageUrls = await uploadReviewImages(req.files)
    const imagesToDelete = req.body.imagesToDelete ? JSON.parse(req.body.imagesToDelete) : []

    const updatedReview = await reviewService.updateReview(reviewId, userId, dataToUpdate, newImageUrls, imagesToDelete)
    res.status(200).json({ success: true, review: formatDates(updatedReview) });
};

reviewController.delete = async (req, res, next) => {
    const reviewId = Number(req.params);
    await reviewService.deleteReview(reviewId, req.user.id);
    res.status(204).send();
};

export default reviewController;