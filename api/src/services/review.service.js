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
      rating: data.rating,
      comment: data.comment,
      productId: Number(productId),
      userId: userId,
      images: {
        create: data.images ? data.images.map(url => ({ url })) : []
      }
    },
    include: {
      images: true,
      user: {
        select: {
          firstName: true,
          profileImage: true
        }
      }
    }
  });
};

reviewService.getReviewsForProduct = (productId) => {
  return prisma.review.findMany({
    where: { productId: Number(productId) },
    include: {
      images: true,
      user: {
        select: {
          firstName: true,
          profileImage: true
        }
      }
    },
    orderBy: {
      reviewDate: "desc"
    }
  });
};

reviewService.findAllReviews = () => {
  return prisma.review.findMany({
    orderBy: {
      reviewDate: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
          profileImage: true
        }
      },
      product: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
};

reviewService.findById = (reviewId) => {
  return prisma.review.findUnique({
    where: {
      id: Number(reviewId)
    }
  });
};

reviewService.update = (reviewId, dataToUpdate) => {
  const { rating, comment } = dataToUpdate;

  return prisma.review.update({
    where: {
      id: Number(reviewId)
    },
    data: {
      rating,
      comment
    }
  });
}



export default reviewService;