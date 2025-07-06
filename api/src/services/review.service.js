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
    },
    include: {
      images: true
    }
  });
};

reviewService.getReviewsForProduct = (productId) => {
  return prisma.review.findMany({
    where: { productId },
    include: {
      images: true
    }
  });
};

reviewService.updateReview = async (reviewId, userId, dataToUpdate, newImageUrls = [], imagesToDelete = []) => {

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.userId !== userId) {
    throw createError(403, "Not allowed to update this review.");
  }


  const { rating, comment } = dataToUpdate;
  const textUpdateData = { rating, comment };

  const imageUpdateLogic = {};
  if (newImageUrls.length > 0) {
    imageUpdateLogic.create = newImageUrls.map(url => ({ url }));
  }
  if (imagesToDelete.length > 0) {
    imageUpdateLogic.deleteMany = {
      id: { in: imagesToDelete.map(id => Number(id)) }
    };
  }


  const finalUpdateData = { ...textUpdateData };
  if (Object.keys(imageUpdateLogic).length > 0) {
    finalUpdateData.images = imageUpdateLogic;
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: finalUpdateData,
    include: { images: true }
  });
};

reviewService.deleteReview = async (reviewId, userId) => {
  throw createError(403, "Review deletion is not allowed.")
  // const review = await prisma.review.findUnique({ where: { id: reviewId } });
  // if (!review || review.userId !== userId) throw createError(403, "Not allowed.");
  // return prisma.review.delete({ where: { id: reviewId } });
};

export default reviewService;