import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const reviewService = {};

reviewService.createReviewForProduct = async (productId, userId, data) => {
  const canReview = await prisma.order.findFirst({
    where: {
      cart: { userId },
      orderStatus: { in: ['DELIVERED', 'COMPLETED'] },
      products: { some: { productId } },
    },
  });
  if (!canReview) throw createError(403, "You can only review products you have purchased.");

  return prisma.review.create({
    data: {
      ...data,
      productId,
      userId,
      images: {
        create: data.images ? data.images.map(url => ({ url })) : []
      }
    }
  });
};

reviewService.getReviewsForProduct = (productId) => {
    return prisma.review.findMany({ where: { productId } });
};

reviewService.updateReview = async (reviewId, userId, data) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId }});
    if (!review || review.userId !== userId) throw createError(403, "Not allowed.");
    return prisma.review.update({ where: { id: reviewId }, data });
};

reviewService.deleteReview = async (reviewId, userId) => {
    const review = await prisma.review.findUnique({ where: { id: reviewId }});
    if (!review || review.userId !== userId) throw createError(403, "Not allowed.");
    return prisma.review.delete({ where: { id: reviewId }});
};

export default reviewService;