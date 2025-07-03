import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

const reviewService = {};

reviewService.createReview = async (productId, userId, data) => {

  const canReview = await prisma.order.findFirst({
    where: {
      cart: { userId: userId },
      orderStatus: { in: ['DELIVERED', 'COMPLETED'] },
      products: { some: { productId: productId } },
    },
  });

  if (!canReview) {
    throw createError(403, "You can only review products you have purchased and received.");
  }
  
  return prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      productId: productId,
      userId: userId,
      images: {
        create: data.images ? data.images.map(url => ({ url })) : []
      }
    }
  });
};

reviewService.getReviewsByProduct = (productId) => {
    return prisma.review.findMany({
        where: { productId },
        include: { user: { select: { firstName: true, profileImage: true } }, images: true },
        orderBy: { reviewDate: 'desc' }
    });
};

export default reviewService;